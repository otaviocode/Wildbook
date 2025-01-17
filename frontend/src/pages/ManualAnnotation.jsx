import React, { useState, useContext, useRef, useEffect } from "react";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import { FormattedMessage } from "react-intl";
import Container from "react-bootstrap/Container";
import MainButton from "../components/MainButton";
import ThemeColorContext from "../ThemeColorProvider";
import ResizableRotatableRect from "../components/ResizableRotatableRect";
import useGetSiteSettings from "../models/useGetSiteSettings";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AnnotationSuccessful from "../components/AnnotationSuccessful";

export default function ManualAnnotation() {

    const [searchParams] = useSearchParams();
    const assetId = searchParams.get("assetId");
    const encounterId = searchParams.get("encounterId");
    const theme = useContext(ThemeColorContext);
    const imgRef = useRef(null);
    const [value, setValue] = useState(0);
    const [data, setData] = useState({
        width: 100,
        height: 100,
        url: ""
    });

    const [showModal, setShowModal] = useState(false); // State to manage Modal visibility
    const [submissionDone, setsubmissionDone] = useState(false); // State to manage submission status

    const { data: siteData } = useGetSiteSettings();

    const iaOptions = siteData?.iaClass?.map((iaClass) => ({
        value: iaClass,
        label: iaClass,
    }));

    const viewpointOptions = siteData?.annotationViewpoint?.map((viewpoint) => ({
        value: viewpoint,
        label: viewpoint,
    }));

    const [ia, setIa] = useState(null);
    const [viewpoint, setViewpoint] = useState(null);

    const [rect, setRect] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0,
    });
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawStatus, setDrawStatus] = useState("DRAW");

    const getMediaAssets = async () => {
        try {
            const response = await fetch(`/api/v3/media-assets/${assetId}`);
            const data = await response.json();
            setData(data);
        } catch (error) {
        }
    };

    console.log("rect", JSON.stringify(rect));

    const [scaleFactor, setScaleFactor] = useState({ x: 1, y: 1 });

    useEffect(() => {
        if (rect.width === 0 || rect.height === 0 || value === 0) {
            return;
        }
        const radians = (value * Math.PI) / 180;
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;

        const theta0 = Math.atan(halfH / halfW);
        const radius = Math.sqrt(halfW * halfW + halfH * halfH);

        const a = Math.cos(radians + theta0) * radius;
        const b = Math.sin(radians + theta0) * radius;

        const cx = rect.x - a;
        const cy = rect.y - b;
        console.log("cx and cy:", cx, cy);

        const x = cx - halfW;
        const y = cy - halfH;

        const radian = (Math.PI / 180) * value;

        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        const dx = -rect.width / 2;
        const dy = -rect.height / 2;
        const originalDx = dx * Math.cos(-radian) - dy * Math.sin(-radian);
        const originalDy = dx * Math.sin(-radian) + dy * Math.cos(-radian);

        const originalX = centerX + originalDx;
        const originalY = centerY + originalDy;
        console.log("x and y after rotation:", rect.x, rect.y);
        console.log("x and y after scale:", rect.x * scaleFactor.x, rect.y * scaleFactor.y);
        console.log("#1 ...jon... x.. and y.. before rotation:", x, y);
        console.log("#2 ...erin... x.. and y.. before rotation:", originalX, originalY);
    }, [value, rect]);

    useEffect(() => {
        if (isDrawing) {
            setDrawStatus("DRAWING");
        } else if (rect.width > 0 && rect.height > 0) {
            setDrawStatus("DELETE");
        } else {
            setDrawStatus("DRAW");
        }
    }, [isDrawing, rect]);

    useEffect(() => {
        const handleImageLoad = () => {
            if (imgRef.current) {
                const naturalWidth = data.width;
                const naturalHeight = data.height;
                const displayWidth = imgRef.current.clientWidth;
                const displayHeight = imgRef.current.clientHeight;

                const scaleX = naturalWidth / displayWidth;
                const scaleY = naturalHeight / displayHeight;

                setScaleFactor({ x: scaleX, y: scaleY });
            }
        };

        const imgElement = imgRef.current;
        if (imgElement && imgElement.complete) {
            handleImageLoad();
        } else if (imgElement) {
            imgElement.addEventListener("load", handleImageLoad);
        }

        return () => {
            if (imgElement) {
                imgElement.removeEventListener("load", handleImageLoad);
            }
        };
    }, [data]);

    useEffect(() => {
        if (assetId && encounterId) {
            const fetchData = async () => {
                await getMediaAssets();
            };
            fetchData();
        }
    }, [assetId, encounterId]);

    useEffect(() => {
        const handleMouseUp = () => setIsDrawing(false);
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, []);

    const handleMouseDown = (e) => {
        if (!imgRef.current || drawStatus === "DELETE") return;

        const { left, top } = imgRef.current.getBoundingClientRect();
        setRect({
            x: e.clientX - left,
            y: e.clientY - top,
            width: 0,
            height: 0,
            rotation: value,
        });
        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        if (!imgRef.current || drawStatus === "DELETE") return;

        const { left, top } = imgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        if (isDrawing) {
            setRect((prevRect) => ({
                ...prevRect,
                width: mouseX - prevRect.x,
                height: mouseY - prevRect.y,
                rotation: value,
            }));
        }
    };

    const handleMouseUp = () => {
        if (!imgRef.current || drawStatus === "DELETE") return;
        setIsDrawing(false);
    };

    return (
        <Container>

            {submissionDone ? <AnnotationSuccessful />
                : <>           <h4 className="mt-3 mb-3">
                    <FormattedMessage id="ADD_ANNOTATIONS" />
                </h4>
                    <Form className="d-flex flex-row">
                        <Form.Group controlId="formBasicEmail" className="me-3">
                            <Form.Label>
                                <FormattedMessage id="IA_CLASS" />*
                            </Form.Label>
                            <Select
                                options={iaOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                menuPlacement="auto"
                                menuPortalTarget={document.body}
                                value={ia}
                                onChange={(selected) => {
                                    setIa(selected)
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>
                                <FormattedMessage id="VIEWPOINT" />*
                            </Form.Label>
                            <Select
                                options={viewpointOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                menuPlacement="auto"
                                menuPortalTarget={document.body}
                                value={viewpoint}
                                onChange={(selected) => {
                                    setViewpoint(selected)
                                }}
                            />
                        </Form.Group>
                    </Form>
                    <div
                        className="d-flex flex-column"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            padding: "1em",
                            marginTop: "1em",
                            borderRadius: "10px",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <div className="d-flex justify-content-between">
                            <h6>
                                <FormattedMessage id="DRAW_ANNOTATION" />
                            </h6>
                            <div
                                style={{
                                    cursor: "pointer",
                                    color: theme.primaryColors.primary500,
                                }}
                                onClick={() => {
                                    if (drawStatus === "DELETE") {
                                        setRect({
                                            x: 0,
                                            y: 0,
                                            width: 0,
                                            height: 0,
                                        });
                                    } else if (drawStatus === "DRAW") {
                                        setDrawStatus("DRAWING");
                                    }
                                }}
                            >
                                <FormattedMessage id={drawStatus} />
                                <i className="bi bi-trash ms-2"></i>
                            </div>
                        </div>
                        <div id="image-container"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            style={{
                                width: "100%",
                                marginTop: "1rem",
                                position: "relative", // Key to enable stacking
                            }}
                        >
                            <img
                                ref={imgRef}
                                src={"http://frontend.scribble.com/wildbook_data_dir/a/1/a1e8b85b-1a22-4ecd-aa8d-59aa93b3322c/48f0d20d-7104-4e8b-9fb6-1d806a831af3-master.jpg"}
                                // src={data.url}
                                alt="annotationimages"
                                style={{
                                    width: "100%",
                                    // maxHeight: "600px",
                                    height: "auto",
                                    objectFit: "contain",
                                    position: "absolute", // Ensure stacking
                                    top: 0,
                                    left: 0,
                                }}
                            />

                            <ResizableRotatableRect
                                rect={rect}
                                imgHeight={imgRef.current?.height}
                                imgWidth={imgRef.current?.width}
                                setRect={setRect}
                                setValue={setValue}
                                drawStatus={drawStatus}
                            />
                        </div>

                    </div>

                    <MainButton
                        noArrow={true}
                        style={{ marginTop: "1em" }}
                        backgroundColor="lightblue"
                        borderColor="#303336"
                        onClick={async () => {
                            try {
                                if (!ia || !viewpoint || !rect.width || !rect.height) {
                                    setShowModal(true);
                                    return;
                                } else {
                                    setShowModal(false);
                                    // setsubmissionDone(true);
                                }
                                const radians = (value * Math.PI) / 180;
                                const originalX = rect.x * Math.cos(radians) + rect.y * Math.sin(radians);
                                const originalY = -rect.x * Math.sin(radians) + rect.y * Math.cos(radians);

                                const response = await axios.request({
                                    method: "post",
                                    url: "/api/v3/annotations",
                                    data: {
                                        "encounterId": encounterId,
                                        "height": rect.height * scaleFactor.y,
                                        "iaClass": ia.value,
                                        "mediaAssetId": assetId,
                                        "theta": (value * Math.PI) / 180,
                                        "viewpoint": viewpoint.value,
                                        "width": rect.width * scaleFactor.x,
                                        "x": originalX * scaleFactor.x,
                                        "y": originalY * scaleFactor.y,

                                    },
                                });

                                const data = await response.json();
                                setData(data);
                            } catch (error) {
                            }

                        }}
                    >
                        <FormattedMessage id="SAVE_ANNOTATION" />
                    </MainButton>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <FormattedMessage id="FORM_INCOMPLETE" />
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormattedMessage id="PLEASE_COMPLETE_FORM" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                <FormattedMessage id="CLOSE" />
                            </Button>
                        </Modal.Footer>
                    </Modal> </>}
        </Container>
    );
}
