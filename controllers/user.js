const userModel = require('../models/user');
const codeGenerator = require('shortid');
const validator = require('../validations/user').userSchema;


exports.getAllUsers = (req,res) => {
    userModel.find({})
    .then((users) => {
        return res.status(200).json({users});
    })
    .catch((err) => {
        return res.status(500).json({err});
    });
}

exports.getReferredUsers = (req,res) => {
    userModel.find({
        referedBy: { $exists: true, $ne: null }
    })
    .then((users) => {
        return res.status(200).json({users});
    })
    .catch((err) => {
        return res.status(500).json({err});
    });
}


exports.signUp = (req,res) => {
    
    console.log(req.body);

    const { error, value } = validator.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({ error });
    }

    const referCode = req.body.referCode;
    const email = req.body.email;
    const password = req.body.password;

    userModel.findOne({
        referCode: referCode
    })
    .then((user) => {
        if(user){
            this.createUser(user,referCode,email,password,res);
        }
        else {
            return res.status(400).json({
                error: "Invalid Refer Code."
            })
        }

    }) 
    .catch((err) => {
        return res.status(500).json({err});
    });

}

exports.createUser = (user,referCode,email,password,res) => {
    if(referCode){
        userModel.create({
            email: email,
            password: password,
            referCode: codeGenerator.generate(),
            referedBy: user._id,
            points: 5
        })
        .then((newUser) => {
            user.points += 10;
            user.totalReferred += 1;
            user.save();
            return res.status(200).json({ newUser });
        })
        .catch((err) => {
            console.log(err);
            if(err.keyPattern.email == 1)
                return res.status(400).json({err : "Email already exists."});
            else return res.status(500).json({ err });
        });    
    }
    else {
        userModel.create({
            email: email,
            password: password,
            referCode: codeGenerator.generate(),
        })
        .then((newUser) => {
            return res.status(200).json({ newUser });
        })
        .catch((err) => {
            console.log(err);
            if(err.keyPattern.email == 1)
                return res.status(400).json({err : "Email already exists."});
            else return res.status(500).json({ err });
        });
    }
};

exports.calculateRevenuefromReferals = (req, res) => {
    
    const { error, value } = validator.validate(req.query);
    if (error) {
        console.log(error);
        return res.status(400).json({ error });
    }

    const uid = req.query.uid;

    if(!uid){
        return res.status(400).json({
            error: "You need to provide an user Id to check."
        })
    }

    userModel.findOne({_id: uid})
    .then((user) => {
        console.log(user);
        return res.status(200).json(
            {
                total_referal_points: user.totalReferred * 10 
            }
        )
    })
    .catch((err) => {
        return res.status(500).json({err});
    });
}

exports.deleteById = (req,res) => {
    const { error, value } = validator.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({ error });
    }

    const uid = req.body.uid;

    userModel.findOneAndDelete({_id: uid}).then((result) => {
        return res.status(200).json({result});
    })
    .catch((err) => {
        return res.status(500).json({err});
    });
}