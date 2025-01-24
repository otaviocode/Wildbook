import React from "react";
import Description from "../Form/Description";
import { FormattedMessage } from "react-intl";
import FormGroupMultiSelect from "../Form/FormGroupMultiSelect";

export default function ObservationAttributeFilter({ onChange, data }) {
  const sexOptions =
    data?.sex?.map((item) => {
      return {
        value: item,
        label: item,
      };
    }) || [];

  const genusAndSpeciesOptions =
    data?.siteTaxonomies?.map((item) => {
      return {
        value: item?.scientificName,
        label: item?.scientificName,
      };
    }) || [];

  return (
    <div
      style={{
        overflow: "visible",
      }}
    >
      <h4>
        <FormattedMessage id="FILTER_OBSERVATION_ATTRIBUTE" />
      </h4>
      <Description>
        <FormattedMessage id="FILTER_OBSERVATION_ATTRIBUTE_DESC" />
      </Description>
      <FormGroupMultiSelect
        isMulti={true}
        noDesc={true}
        label="FILTER_INDIVIDUAL_SEX"
        options={sexOptions}
        onChange={onChange}
        field="individualSex"
        term="terms"
        filterKey="individualSex"
      />
      <FormGroupMultiSelect
        isMulti={true}
        label="FILTER_INDIVIDUAL_TAXONOMY"
        noDesc={true}
        options={genusAndSpeciesOptions}
        onChange={onChange}
        field="individualtaxonomy"
        term="terms"
        filterId={"sightingsTaxonomy"}
        filterKey={"Individual Taxonomy"}
      />
    </div>
  );
}
