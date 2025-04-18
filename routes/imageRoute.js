const express = require("express");
const ImageKit = require("imagekit");

const router = express.Router();

const imagekit = new ImageKit({
  publicKey: "public_mh1DJX70VjFb83E9CNt55he+yhg=",
  privateKey: "private_kpbX9EwlTpaaEuPy0wnkqLtWqAU=",
  urlEndpoint: "https://ik.imagekit.io/l8lupmt5w/",
});

router.get("/imagekit-auth", (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
});

module.exports = router;
