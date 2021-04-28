// These lines gets replaced by server.js if specified.
const RFUNC_PORT = 3350;
const RFUNC_ADDRESS = undefined;

import createEndpoint from "rfunc";
import createMedia from "/io_client_media";

let endpoint = createEndpoint();
// TODO: Load endpoint with all client-side functions

let rfuncAddress = RFUNC_ADDRESS || window.location.hostname;
createMedia({
  address: rfuncAddress,
  port: RFUNC_PORT,
  onCreate(media) {
    endpoint.setMedia(media);
    let greet = endpoint.registerRemote("greet");
    greet("Browser", poke);
  }
});
