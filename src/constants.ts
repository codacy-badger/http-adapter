export const constants = {

  INIT_CONTEXT_TEMPLATE_FUNC_PREFIX: '__init_ctx_template_',

  INIT_FUNC_PREFIX: '__init_function_',

  VERIFY_REQ_HEADER_PREFIX: '__validate_req_header_',

  VERIFY_REQ_BODY_PREFIX: '__validate_req_body_',

  // __relay_header_template_0_foo()
  RELAY_HEADER_TEMPLATE_FUNC_PREFIX: '__relay_header_template_',

  // __relay_template_0_url()
  RELAY_PROP_TEMPLATE_FUNC_PREFIX: '__relay_template_',

  RELAY_INTERCEPTOR_FUNC_PREFIX: '__relay_interceptor_template_',

  RESP_HEADER_TEMPLATE_FUNC_PREFIX: '__resp_header_template_',

  RESP_PROP_TEMPLATE_FUNC_PREFIX: '__resp_template_',

  RESP_INTERCEPTOR_FUNC_PREFIX: '__resp_interceptor_template_',

  URL_PROP_SUFFIX: '_url',

  BODY_PROP_SUFFIX: '_body',

  // if put '_' as relay request url, means manually intercept mode, request won't be sent
  DUMMY_URL: '_'
};