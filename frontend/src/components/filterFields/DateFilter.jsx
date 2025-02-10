import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import Description from "../Form/Description";
import FormGroupMultiSelect from "../Form/FormGroupMultiSelect";
import { FormLabel, FormGroup, FormControl } from "react-bootstrap";
import { useSearchQueryParams } from "../../models/useSearchQueryParams";
import { useStoredFormValue } from "../../models/useStoredFormValue";
import { observer } from "mobx-react-lite";

const DateFilter = observer(({ data, store }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submissionStartDate, setSubmissionStartDate] = useState("");
  const [submissionEndDate, setSubmissionEndDate] = useState("");

  console.log("store11111", JSON.stringify(store));

  // const paramsObject = useSearchQueryParams();
  // const savedEncounterDateValues = useStoredFormValue("date", "range", "date");
  // const savedSubmissionDateValues = useStoredFormValue(
  //   "dateSubmitted",
  //   "range",
  //   "dateSubmitted",
  // );

  // useEffect(() => {
  //   if (paramsObject.searchQueryId && savedEncounterDateValues) {
  //     setStartDate(savedEncounterDateValues.gte.split("T")[0]);
  //     setEndDate(savedEncounterDateValues.lte.split("T")[0]);
  //   }
  //   if (paramsObject.searchQueryId && savedSubmissionDateValues) {
  //     setSubmissionStartDate(savedSubmissionDateValues.gte.split("T")[0]);
  //     setSubmissionEndDate(savedSubmissionDateValues.lte.split("T")[0]);
  //   }
  // }, [paramsObject, savedEncounterDateValues, savedSubmissionDateValues]);

  const verbatimeventdateOptions =
    data?.verbatimEventDate?.map((data) => {
      return {
        value: data,
        label: data,
      };
    }) || [];

  useEffect(() => {
    updateQuery1("startDate", startDate);
  }, [startDate]);
  useEffect(() => {
    updateQuery1("endDate", endDate);
  }, [endDate]);

  useEffect(() => {
    updateQuery2("submissionStartDate", submissionStartDate);
  }, [submissionStartDate]);

  useEffect(() => {
    updateQuery2("submissionEndDate", submissionEndDate);
  }, [submissionEndDate]);

  const updateQuery1 = () => {
    if (startDate || endDate) {
      const query = {
        range: {
          date: {},
        },
      };

      if (startDate) {
        query.range.date.gte = startDate + "T00:00:00Z";
      }

      if (endDate) {
        query.range.date.lte = endDate + "T23:59:59Z";
      }

      store.addFilter("date", "filter", query, "Sighting Date");
    } else {
      store.removeFilter("date");
    }
  };

  const updateQuery2 = () => {
    if (submissionStartDate || submissionEndDate) {
      const query = {
        range: {
          dateSubmitted: {},
        },
      };

      if (submissionStartDate) {
        query.range.dateSubmitted.gte = submissionStartDate + "T00:00:00Z";
      }

      if (submissionEndDate) {
        query.range.dateSubmitted.lte = submissionEndDate + "T23:59:59Z";
      }

      store.addFilter("dateSubmitted", "filter", query, "Date Submitted");
    } else {
      store.removeFilter("dateSubmitted");
    }
  };

  return (
    <div>
      <h4>
        <FormattedMessage id="FILTER_DATE" />
      </h4>
      <Description>
        <FormattedMessage id="FILTER_DATE_DESC" />
      </Description>
      <>
        <FormLabel>
          <FormattedMessage id="FILTER_ENCOUNTER_DATE" />
        </FormLabel>
        <div className="d-flex flex-row w-100 mb-2">
          <FormGroup className="w-50" style={{ marginRight: "10px" }}>
            <p>
              <FormattedMessage id="FILTER_FROM" defaultMessage="From" />
            </p>
            <FormControl
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                updateQuery1();
              }}
            />
          </FormGroup>
          <FormGroup className="w-50">
            <p>
              <FormattedMessage id="FILTER_TO" defaultMessage="To" />
            </p>
            <FormControl
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                updateQuery1();
              }}
            />
          </FormGroup>
        </div>
      </>

      <FormGroupMultiSelect
        isMulti={true}
        noDesc
        label="FILTER_VERBATIM_EVENT_DATE"
        options={verbatimeventdateOptions}
        term="terms"
        field="verbatimEventDate"
        filterKey="Verbatim Event Date"
        store={store}
      />

      <>
        <p>
          <FormLabel class="mt-3">
            <FormattedMessage id="FILTER_ENCOUNTER_SUBMISSION_DATE" />
          </FormLabel>
        </p>

        <div className="d-flex flex-row w-100 mb-2">
          <FormGroup className="w-50" style={{ marginRight: "10px" }}>
            <p>
              <FormattedMessage id="FILTER_FROM" defaultMessage="From" />
            </p>
            <FormControl
              type="date"
              value={submissionStartDate}
              onChange={(e) => {
                setSubmissionStartDate(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup className="w-50">
            <p>
              <FormattedMessage id="FILTER_TO" defaultMessage="To" />
            </p>
            <FormControl
              type="date"
              value={submissionEndDate}
              onChange={(e) => {
                setSubmissionEndDate(e.target.value);
              }}
            />
          </FormGroup>
        </div>
      </>
    </div>
  );
});

export default DateFilter;
