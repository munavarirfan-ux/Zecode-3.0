import type { CreateEnterpriseFieldErrors, CreateEnterpriseFormState } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
const PHONE_RE = /^[0-9]{6,14}$/;

export function validateEnterpriseDetails(
  details: CreateEnterpriseFormState["details"],
): CreateEnterpriseFieldErrors {
  const errors: CreateEnterpriseFieldErrors = {};

  if (!details.organisationName.trim()) errors.organisationName = "Organisation name is required";
  if (!details.domainName.trim()) {
    errors.domainName = "Domain name is required";
  } else if (!DOMAIN_RE.test(details.domainName.trim())) {
    errors.domainName = "Enter a valid domain (e.g. acme.com)";
  }
  if (!details.defaultBaseDomain.trim()) {
    errors.defaultBaseDomain = "Default base domain is required";
  } else if (!DOMAIN_RE.test(details.defaultBaseDomain.trim())) {
    errors.defaultBaseDomain = "Enter a valid base domain";
  }
  if (!details.natureOfBusiness) errors.natureOfBusiness = "Select nature of business";
  if (!details.location.trim()) errors.location = "Location is required";
  if (!details.spocName.trim()) errors.spocName = "SPOC name is required";
  if (!details.spocEmail.trim()) {
    errors.spocEmail = "SPOC email is required";
  } else if (!EMAIL_RE.test(details.spocEmail.trim())) {
    errors.spocEmail = "Enter a valid email address";
  }

  if (details.monthlyAssessments.trim()) {
    const n = Number(details.monthlyAssessments);
    if (Number.isNaN(n) || n < 0) errors.monthlyAssessments = "Cannot be negative";
  }
  if (details.numberOfEmployees.trim()) {
    const n = Number(details.numberOfEmployees);
    if (Number.isNaN(n) || n < 0) errors.numberOfEmployees = "Cannot be negative";
  }
  if (details.spocPhone.trim() && !PHONE_RE.test(details.spocPhone.replace(/\s/g, ""))) {
    errors.spocPhone = "Enter a valid mobile number";
  }

  return errors;
}

export function hasValidationErrors(errors: CreateEnterpriseFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
