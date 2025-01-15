/* eslint-disable prefer-destructuring */
import * as Yup from "yup";

import { labels } from "~/modules/profile/utils/labels";

export const apiKeyBasedServiceFormSchema = Yup.object().shape({
  apikey: Yup.string().required(labels.shouldNotBeBlank),
  appId: Yup.string().optional().nullable(),
  username: Yup.string().optional().nullable(),
  password: Yup.string().optional().nullable(),
});

export const credentailBasedServiceFormSchema = Yup.object().shape({
  apikey: Yup.string().required(labels.shouldNotBeBlank),
  appId: Yup.string().required(labels.shouldNotBeBlank),
  username: Yup.string().required(labels.shouldNotBeBlank),
  password: Yup.string().required(labels.shouldNotBeBlank),
});

export const basicCredentailFormSchema = Yup.object().shape({
  apikey: Yup.string().optional().nullable(),
  appId: Yup.string().optional().nullable(),
  username: Yup.string().required(labels.shouldNotBeBlank),
  password: Yup.string().required(labels.shouldNotBeBlank),
});

export const apiKeyWithUsernameFormSchema = Yup.object().shape({
  apikey: Yup.string().required(labels.shouldNotBeBlank),
  username: Yup.string().required(labels.shouldNotBeBlank),
});

export const bearerTokenFormSchema = Yup.object().shape({
  token: Yup.string().required(labels.shouldNotBeBlank),
});
