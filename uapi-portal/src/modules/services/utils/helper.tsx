/* eslint-disable no-param-reassign */
import {
  CompanyServices,
  ServiceCategory,
  Services,
  ServiceType,
} from "~/rest/models/service";

import { ServiceProviderGroup } from "~/modules/profile/interface/profile";
import { ServiceGroupType } from "~/modules/profile/utils/helper";

import AzmFintech from "~/public/assets/azmfintech.svg";
import CommercialContractIssuingLogo from "~/public/assets/CommercialContractIssuing.svg";
import CommercialRegistrationLogo from "~/public/assets/CommercialRegistration.svg";
import Contracts from "~/public/assets/contractsLogo.svg";
import Deewan from "~/public/assets/Deewan.svg";
import Edaat from "~/public/assets/edaat.svg";
import Etimad from "~/public/assets/etimad.svg";
import Lean from "~/public/assets/lean.svg";
import Masdr from "~/public/assets/masdr.svg";
import Msegat from "~/public/assets/msegat.svg";
import NationalAddressLogo from "~/public/assets/nationalAddress.svg";
import PowerOfAttorneyLogo from "~/public/assets/PowerOfAttorney.svg";
import RealEstatesDeedsLogo from "~/public/assets/RealEstatesDeeds.svg";
import SimahLogo from "~/public/assets/simah.svg";
import TCC from "~/public/assets/tcc_logo.svg";
import Unifonic from "~/public/assets/Unifonic.svg";
import Yakeen from "~/public/assets/yakeen.svg";

export interface ServiceCardInterface {
  heading: string;
  description: string;
  serviceGroup: string;
  buttonText: string;
  footerText: string;
  variant: "text" | "outlined" | "contained";
  path: string;
  serviceOperations: Services[];
  logo?: any;
  logoName?: any;
  subscribed?: boolean;
  serviceHeadId?: any;
  setTriggerRefetch?: any;
  logoLoading?: boolean;
}

export interface SideBarItemInterface {
  displayText: string;
  value: string;
}

export interface ServiceCollectionProps {
  serviceCollection: ServiceCategory;
}

export const filteredCompanyService = (
  companyService: CompanyServices[],
  allServices: ServiceType[]
) => {
  const companyServiceArray: ServiceType[] = [];

  companyService.forEach((companyService) => {
    const serviceId = companyService.service.id;
    allServices.forEach((item) => {
      const filteredArray = item.services.filter((key) => key.id === serviceId);

      if (filteredArray.length > 0) {
        const filteredCheckedArray = companyServiceArray.filter(
          (value) => value.name === item.name
        );
        if (filteredCheckedArray.length === 0) {
          const serviceHead = { ...item };

          serviceHead.services = [companyService.service];
          serviceHead.subscribed = companyService.subscribed;
          serviceHead.serviceHeadId = companyService.service.serviceHeadId;
          companyServiceArray.push(serviceHead);
        } else {
          filteredCheckedArray[0].services.push(companyService.service);
        }
      }
    });
  });

  return companyServiceArray;
};

export const categorizeServices = (services: ServiceType[]) => {
  const categorizeArray: ServiceCategory[] = [];
  services.forEach((item) => {
    const filteredArray = services.filter(
      (key) => key.originalServiceHead.name === item.originalServiceHead.name
    );
    if (filteredArray.length > 0) {
      if (
        categorizeArray.filter(
          (value) =>
            value.originalServiceHead.name === item.originalServiceHead.name
        ).length === 0
      ) {
        const category: ServiceCategory = {
          name: item.originalServiceHead.name,
          originalServiceHead: item.originalServiceHead,
          serviceProvider: item.serviceProvider,
          collection: filteredArray,
        };
        categorizeArray.push(category);
      }
    }
  });

  return categorizeArray;
};

export const categorizeServicesByServiceProvider = (
  services: ServiceType[]
) => {
  const categorizeArray: ServiceCategory[] = [];
  services.forEach((item) => {
    const filteredArray = services.filter(
      (key) => key.serviceProvider.name === item.serviceProvider.name
    );
    if (filteredArray.length > 0) {
      if (
        categorizeArray.filter(
          (value) => value.name === item.serviceProvider.name
        ).length === 0
      ) {
        const category: ServiceCategory = {
          name: item.serviceProvider.name,
          originalServiceHead: item.originalServiceHead,
          serviceProvider: item.serviceProvider,
          collection: filteredArray,
        };
        categorizeArray.push(category);
      }
    }
  });

  return categorizeArray;
};

export const getServiceGroups: (array: any[]) => any[] = (array) => {
  const filteredObjects = array
    .filter((obj) => obj.serviceProvider.clientCredentialsAllowed)
    .map((obj) => {
      const childItems = obj.collection.map((child: any) => {
        const childrenGroup: ServiceProviderGroup = {
          id: child.id,
          title: child.name,
          type: ServiceGroupType.SERVICE_HEAD,
          parent: obj.name.toLowerCase(),
          showIcon: obj.serviceProvider.requiresServiceHeadCredentials,
        };
        return childrenGroup;
      });

      const parentGroup: ServiceProviderGroup = {
        id: obj.serviceProvider.id,
        title: obj.name.toLowerCase(),
        type: ServiceGroupType.SERVICE_PROVIDER,
        parent: obj.name.toLowerCase(),
        children: childItems,
        showIcon: !obj.serviceProvider.requiresServiceHeadCredentials,
      };
      return parentGroup;
    });

  return filteredObjects;
};

export const getServiceLogo = (serviceGroup: string, heading: string) => {
  if (serviceGroup === "SIMAH") {
    return SimahLogo;
  } else if (heading === "Real Estates Deeds") {
    return RealEstatesDeedsLogo;
  } else if (heading === "Power Of Attorney") {
    return PowerOfAttorneyLogo;
  } else if (heading === "Commercial Registration") {
    return CommercialRegistrationLogo;
  } else if (heading === "Article of Association") {
    return CommercialContractIssuingLogo;
  } else if (heading === "National Address") {
    return NationalAddressLogo;
  } else if (serviceGroup === "YAKEEN") {
    return Yakeen;
  } else if (serviceGroup === "MASDR") {
    return Masdr;
  } else if (serviceGroup === "ETIMAD") {
    return Etimad;
  } else if (serviceGroup === "UNIFONIC") {
    return Unifonic;
  } else if (serviceGroup === "MSEGAT") {
    return Msegat;
  } else if (serviceGroup === "AZM") {
    return AzmFintech;
  } else if (serviceGroup === "FINTECH") {
    return Edaat;
  } else if (serviceGroup === "LEAN TECH") {
    return Lean;
  } else if (serviceGroup === "DEEWAN") {
    return Deewan;
  } else if (serviceGroup === "AZM DIGITAL") {
    return Contracts;
  } else {
    return TCC;
  }
};

export const upcomingServicesList = [""];
