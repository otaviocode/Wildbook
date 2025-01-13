import React, { useState, useContext, useRef, useEffect } from "react";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import { FormattedMessage } from "react-intl";
import Container from "react-bootstrap/Container";
import MainButton from "../components/MainButton";
import ThemeColorContext from "../ThemeColorProvider";
import Slider from "../components/Slider";
import ResizableRotatableRect from "../components/ResizableRotatableRect";

export default function ManualAnnotation() {
    const theme = useContext(ThemeColorContext);
    const imgRef = useRef(null);
    const [value, setValue] = useState(0);

    const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDraggingRect, setIsDraggingRect] = useState(false);
    const [hoveringRect, setHoveringRect] = useState(false);

    const getMediaAssets = async () => {
        try {
            const response = await fetch("/api/v3/media-assets/329716");
            const data = await response.json();
            console.log("++++++++++++++++++++++++++++",data);
        } catch (error) {
            console.error("-------------------------------",error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getMediaAssets();
        };
        fetchData();
    }, []);
        

    useEffect(() => {
        const handleMouseUp = () => setIsDrawing(false);
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, []);


    const handleMouseDown = (e) => {
        if (!imgRef.current) return;

        if (hoveringRect) {
            setIsDraggingRect(true);
            return;
        }

        const { left, top } = imgRef.current.getBoundingClientRect();
        setRect({
            x: e.clientX - left,
            y: e.clientY - top,
            width: 0,
            height: 0,
        });
        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        if (!imgRef.current) return;

        const { left, top } = imgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        const isInsideRect =
            mouseX >= rect.x - 4 &&
            mouseX <= rect.x + rect.width + 4 &&
            mouseY >= rect.y - 4 &&
            mouseY <= rect.y + rect.height + 4;

        console.log("isInsideRect", isInsideRect);

        setHoveringRect(isInsideRect);

        if (isDrawing) {
            setRect((prevRect) => ({
                ...prevRect,
                width: mouseX - prevRect.x,
                height: mouseY - prevRect.y,
            }));
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setIsDraggingRect(false);
    };


    return (
        <Container>
            <h4 className="mt-3 mb-3">
                <FormattedMessage id="ADD_ANNOTATIONS" />
            </h4>
            <Form className="d-flex flex-row">
                <Form.Group controlId="formBasicEmail" className="me-3">
                    <Form.Label>
                        <FormattedMessage id="IA_CLASS" />*
                    </Form.Label>
                    <Select
                        isMulti={true}
                        options={[]}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        menuPlacement="auto"
                        menuPortalTarget={document.body}
                        value={[]}
                        onChange={() => { }}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>
                        <FormattedMessage id="VIEWPOINT" />*
                    </Form.Label>
                    <Select
                        isMulti={true}
                        options={[]}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        menuPlacement="auto"
                        menuPortalTarget={document.body}
                    />
                </Form.Group>
            </Form>
            <div
                className="d-flex w-100 flex-column"
                style={{
                    height: "80vh",
                    padding: "1em",
                    marginTop: "1em",
                    borderRadius: "10px",
                    overflow: "hidden",
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
                    >
                        <FormattedMessage id="DELETE" />
                        <i className="bi bi-trash ms-2"></i>
                    </div>
                </div>
                <div
                    className="d-flex w-100 flex-column"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{
                        height: "80vh",
                        marginTop: "1em",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                        position: "relative", // Key to enable stacking
                    }}
                >
                    <img
                        ref={imgRef}
                        src={`${process.env.PUBLIC_URL}/images/forest.png`}
                        alt="annotationimages"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "fill",
                            position: "absolute", // Ensure stacking
                            top: 0,
                            left: 0,
                        }}
                    />
                    <ResizableRotatableRect
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        imgHeight={imgRef.current?.height}
                        imgWidth={imgRef.current?.width}
                        setIsDraggingRect={setIsDraggingRect}
                        setRect={setRect}
                        angle={value}
                    />

                </div>

                <Slider
                    min={0}
                    max={360}
                    step={1}
                    setValue={setValue}

                />
            </div>
            <MainButton
                noArrow={true}
                style={{ marginTop: "1em" }}
                backgroundColor="lightblue"
                borderColor="#303336"
            >
                <FormattedMessage id="SAVE_ANNOTATION" />
            </MainButton>
        </Container>
    );
}



