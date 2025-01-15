const express = require('express');
const router = express.Router();

// Note to self:
// router.reqtype('link',(req,res) => {Func})
router.get( '/' , (req,res) =>{
    res.send('Server running');
});

module.exports = router;