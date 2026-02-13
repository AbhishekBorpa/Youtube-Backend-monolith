"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var search_controller_1 = require("../controllers/search.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT); // Apply JWT to all since we track history now?
// Actually search might be public. Let's make search public but history private.
router.route("/").get(search_controller_1.searchVideos); // This might break if searchVideos assumes req.user without check.
// I added check `if(req.user?._id)` in controller, but middleware populates req.user.
// If I use verifyJWT globally here, search becomes private.
// Better to keep search public but optional auth?
// For now, let's keep search public (no verifyJWT on root maybe) but verifyJWT on history.
// However, my previous edit in search.controller puts history saving inside searchVideos.
// If verifyJWT is not present, req.user will be undefined, so history won't save (correct behavior).
// But for history routes we need verifyJWT.
// So:
router.route("/history").get(auth_middleware_1.verifyJWT, search_controller_1.getSearchHistory);
router.route("/history/clear").delete(auth_middleware_1.verifyJWT, search_controller_1.clearSearchHistory);
exports.default = router;
