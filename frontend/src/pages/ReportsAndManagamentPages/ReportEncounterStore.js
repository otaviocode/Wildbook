import { makeAutoObservable } from "mobx";

export class ReportEncounterStore {
  _imageSectionSubmissionId;
  _imageRequired;
  _imageSectionUploadSuccess;
  _imageSectionFileNames;
  _startUpload;
  _dateTimeSection;
  _speciesSection;
  _placeSection;
  _followUpSection;
  _additionalCommentsSection;

  constructor() {
    this._imageSectionSubmissionId = "";
    this._imageRequired = true;
    this._imageSectionUploadSuccess = false;
    this._imageSectionFileNames = [];
    this._startUpload = false;
    this._dateTimeSection = {
      value: "",
      error: false,
    };
    this._speciesSection = {
      value: "",
      error: false,
      required: true,
    };
    this._placeSection = {
      value: "",
      error: false,
    };
    this._additionalCommentsSection = {
      value: "",
    };
    this._followUpSection = {
      submitter: {
        name: "",
        email: "",
      },
      photographer: {
        name: "",
        email: "",
      },
      additionalEmails: "",
      error: false,
    };
    makeAutoObservable(this);
  }

  // Getters
  get imageSectionSubmissionId() {
    return this._imageSectionSubmissionId;
  }

  get imageRequired() {
    return this._imageRequired;
  }

  get imageSectionUploadSuccess() {
    return this._imageSectionUploadSuccess;
  }

  get imageSectionFileNames() {
    return this._imageSectionFileNames;
  }

  get startUpload() {
    return this._startUpload;
  }

  get dateTimeSection() {
    return this._dateTimeSection;
  }

  get speciesSection() {
    return this._speciesSection;
  }

  get placeSection() {
    return this._placeSection;
  }

  get followUpSection() {
    return this._followUpSection;
  }

  // Actions
  setImageSectionSubmissionId(value) {
    this._imageSectionSubmissionId = value;
  }

  setImageRequired(value) {
    this._imageRequired = value;
  }

  setImageSectionUploadSuccess(value) {
    this._imageSectionUploadSuccess = value;
  }

  setImageSectionFileNames(value) {
    this._imageSectionFileNames = value;
  }

  setStartUpload(value) {
    this._startUpload = value;
  }

  setSpeciesSectionValue(value) {
    this._speciesSection.value = value;
  }

  setSpeciesSectionError(error) {
    this._speciesSection.error = error;
  }

  setPlaceSection(value) {
    this._placeSection.value = value;
  }

  setFollowUpSection(value) {
    this._followUpSection.value = value;
  }

  setCommentsSectionValue(value) {
    this._additionalCommentsSection.value = value;
  }

  setSubmitterName(name) {
    this._followUpSection.submitter.name = name;
  }

  setSubmitterEmail(email) {
    this._followUpSection.submitter.email = email;
  }

  setPhotographerName(name) {
    this._followUpSection.photographer.name = name;
  }

  setPhotographerEmail(email) {
    this._followUpSection.photographer.email = email;
  }

  setAdditionalEmails(value) {
    this._followUpSection.additionalEmails = value;
  }

  validateEmails() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (this._followUpSection.submitter.email) {
      if (!emailPattern.test(this._followUpSection.submitter.email))
        return false;
    }

    if (this._followUpSection.photographer.email) {
      if (!emailPattern.test(this._followUpSection.photographer.email))
        return false;
    }

    if (this._followUpSection.additionalEmails) {
      return this._followUpSection.additionalEmails
        .split(",")
        .every((email) => {
          return emailPattern.test(email.trim());
        });
    }

    return true;
  }

  validateFields() {
    let isValid = true;

    if (!this._speciesSection.value) {
      this._speciesSection.error = true;
      isValid = false;
    } else {
      this._speciesSection.error = false;
    }

    if (!this.validateEmails()) {
      console.log("email validation failed");
      isValid = false;
    } else {
      console.log("Followup information validated");
    }

    // Uncomment the place section validation if needed
    // if (!this._placeSection.value) {
    //   this._placeSection.error = true;
    //   isValid = false;
    // } else {
    //   this._placeSection.error = false;
    // }

    return isValid;
  }

  async submitReport() {
    if (this.validateFields()) {
      console.log("Report submitted", this._speciesSection.value);
      // Additional logic for report submission can be added here.
    } else {
      console.error("Validation failed");
    }
  }
}

export default ReportEncounterStore;
