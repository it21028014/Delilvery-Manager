const router = require("express").Router();
const bcrypt = require("bcryptjs");

const ApiResult = require("../Models/Common/ApiResult");
const DeliveryPartner = require("../Models/DeliveryPartner/DeliveryPartner");
const Order = require("../Models/Order/Order");
const PrintController = require("../Models/Common/PrintController");

//-- Save Delivery Partner
router.post("/saveDeliveryPartner", async (req, res)=>{
    try{
        const resOrder = await Order.find();
        let dateStamp = "" + Date.now();
        const driverId = "DP" + dateStamp.substring(7);

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const saveObject = {
            driverId: driverId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNo: req.body.phoneNo,
            nic: req.body.nic,
            licenseNo: req.body.licenseNo,
            address: req.body.address,
            password: hashPassword,
            vehicaleDet:{
                vehicleNo: req.body.vehicleNo,
                vehicleType: req.body.vehicleType,
                capacity: req.body.capacity,
                yearOfManufact: req.body.yearOfManufact,
                freezer: req.body.freezer,
            },
            bankDet:{
                name: req.body.name,
                bankName: req.body.bankName,
                accNo: req.body.accNo,
                branchName: req.body.branchName,
                branchNo: req.body.branchNo,
            }
        }
        const resSave = await new DeliveryPartner(saveObject).save();
        if(resSave){
            return res.send(new ApiResult(true, "Succesfully saved !"));
        }
        else{
            return res.send(new ApiResult(false, "Error !"));
        }

    } catch(err){
        return res.send(new ApiResult(false, err.message));
    }
});

//-- Get Delivery Partner Details
router.get("/deliveryPartnerDet", async (req, res)=>{
    try{
        const resData = await DeliveryPartner.aggregate([
          {
            $lookup: {
              from: "orders",
              localField: "driverId",
              foreignField: "deliveryPartnerId",
              as: "order_info",
            },
          },
          {
            $unwind: { path: "$order_info", preserveNullAndEmptyArrays: true },
          },
          {
            $group: {
              _id: {
                driverId: "$driverId",
                deliveryStatus: "$order_info.deliveryStatus",
              },
              count: { $sum: 1 },
              firstName: { $first: "$firstName" },
              lastName: { $first: "$lastName" },
              vehicleNo: { $first: "$vehicaleDet.vehicleNo" },
              phoneNo: { $first: "$phoneNo" },
              totalPayment: { $sum: "$order_info.deliveryPrice" },
            },
          },
          {
            $addFields: {
              ordersDone: {
                $cond: [{ $eq: ["$_id.deliveryStatus", "d"] }, "$count", 0],
              },
            },
          },
          {
            $addFields: {
              incompleteOrders: {
                $cond: [{ $eq: ["$_id.deliveryStatus", "a"] }, "$count", 0],
              },
            },
          },
          {
            $group: {
              _id: "$_id.driverId",
              firstName: { $first: "$firstName" },
              lastName: { $first: "$lastName" },
              vehicleNo: { $first: "$vehicleNo" },
              phoneNo: { $first: "$phoneNo" },
              totalPayment: { $sum: "$totalPayment" },
              ordersDone: { $sum: "$ordersDone" },
              incompleteOrders: { $sum: "$incompleteOrders" },
            },
          },
          {
            $project: {
              driverId: "$_id",
              firstName: 1,
              lastName: 1,
              vehicleNo: 1,
              phoneNo: 1,
              totalPayment: 1,
              ordersDone: 1,
              incompleteOrders: 1,
              _id: 0,
            },
          },
        ]);
        if(resData.length === 0){
            return res.send(new ApiResult(false, "No data found!"));
        } else{
            return res.send(new ApiResult(true, resData));
        }
    } catch (err){
        res.send(new ApiResult(false, err.message));
    }
});

//-- Delete Delivery Partner
router.post("/deleteDeliveryPartner", async (req, res) =>{
    try{
        const resDelete = await DeliveryPartner.deleteOne({driverId: req.body.driverId});
        if(resDelete){
            return res.send(new ApiResult(true, "Succesfully Deleted."))
        } else{
            return res.send(new ApiResult(false, "Error."))
        }
    }catch(err){
        res.send(new ApiResult(false, err.message));
    }
});

//-- Get Orders
router.get("/getOrders", async (req, res)=>{
    try{
        const resOrder = await Order.find().lean();
        if(resOrder) {
            return res.send(new ApiResult(true, resOrder));
        }
        else return res.send(new ApiResult(false, "No data found!"));
    }catch(err){
        return res.send(new ApiResult(false, err.message));
    }
});

//-- Get Delivery Partners
router.get("/getDeliveryPartners", async (req, res)=>{
    try{
        const resDp = await DeliveryPartner.find({}, {firstName: 1, lastName: 1, _id: 0}).lean();
        if(resDp) {
            const dpName = resDp.map((val)=> {return( val.firstName + " " + val.lastName)})
            return res.send(new ApiResult(true, dpName));
        }
        else return res.send(new ApiResult(false, "No data found!"));
    }catch(err){
        return res.send(new ApiResult(false, err.message));
    }
});

//-- Assign Delivery Partner to order
router.post("/assignDp", async (req, res)=>{
    try{
        const resDriverId = await DeliveryPartner.findOne(
            {
                firstName: req.body.deliveryPartnerName.split(" ")[0],
                lastName: req.body.deliveryPartnerName.split(" ")[1]
            },
            {_id: 0, driverId: 1}
        );
        if(!resDriverId){
            return res.send(new ApiResult(false, "Cannot find driver"));
        }

        const resAssignDp = await Order.findOneAndUpdate(
            {orderId: req.body.orderId},
            {
                estimatedDeliveryDate: req.body.estimatedDeliveryDate,
                deliveryPartnerName: req.body.deliveryPartnerName,
                deliveryPartnerId: resDriverId.driverId,
                deliveryStatus: "a"
            }
        );
        if(resAssignDp){
            return res.send(new ApiResult(true, "Succesfully saved !"));
        }
        else{
            return res.send(new ApiResult(false, "Error !"));
        }

    } catch(err){
        return res.send(new ApiResult(false, err.message));
    }
});

//-- Delete order
router.post("/deleteOrder", async (req, res) =>{
    try{
        const resDelete = await Order.deleteOne({orderId: req.body.orderId});
        if(resDelete){
            return res.send(new ApiResult(true, "Succesfully Deleted."))
        } else{
            return res.send(new ApiResult(false, "Error."))
        }
    }catch(err){
        res.send(new ApiResult(false, err.message));
    }
});

//-- Print Delivery Partner Details
router.post("/printDP", async (req, res) =>{
    try {
        const resData = await DeliveryPartner.aggregate([
          {
            $lookup: {
              from: "orders",
              localField: "driverId",
              foreignField: "deliveryPartnerId",
              as: "order_info",
            },
          },
          {
            $unwind: { path: "$order_info", preserveNullAndEmptyArrays: true },
          },
          {
            $group: {
              _id: {
                driverId: "$driverId",
                deliveryStatus: "$order_info.deliveryStatus",
              },
              count: { $sum: 1 },
              firstName: { $first: "$firstName" },
              lastName: { $first: "$lastName" },
              vehicleNo: { $first: "$vehicaleDet.vehicleNo" },
              phoneNo: { $first: "$phoneNo" },
              totalPayment: { $sum: "$order_info.deliveryPrice" },
            },
          },
          {
            $addFields: {
              ordersDone: {
                $cond: [{ $eq: ["$_id.deliveryStatus", "d"] }, "$count", 0],
              },
            },
          },
          {
            $addFields: {
              incompleteOrders: {
                $cond: [{ $eq: ["$_id.deliveryStatus", "a"] }, "$count", 0],
              },
            },
          },
          {
            $group: {
              _id: "$_id.driverId",
              firstName: { $first: "$firstName" },
              lastName: { $first: "$lastName" },
              vehicleNo: { $first: "$vehicleNo" },
              phoneNo: { $first: "$phoneNo" },
              totalPayment: { $sum: "$totalPayment" },
              ordersDone: { $sum: "$ordersDone" },
              incompleteOrders: { $sum: "$incompleteOrders" },
            },
          },
          {
            $project: {
              driverId: "$_id",
              firstName: 1,
              lastName: 1,
              vehicleNo: 1,
              phoneNo: 1,
              totalPayment: 1,
              ordersDone: 1,
              incompleteOrders: 1,
              _id: 0,
            },
          },
        ]);

        const objPrint = {
            arrDriverDet: resData
        }

        const resReport = await PrintController("DeliveryPartner.hbs", {...objPrint, strReportName: 'Delivery Partner Details'}, []);
        res.send(new ApiResult(resReport.booStatus, resReport.objResponse));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

//-- Get data to char
router.get("/getChartData", async(req, res)=>{
  try{
    const resData = await DeliveryPartner.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "driverId",
          foreignField: "deliveryPartnerId",
          as: "order_info",
        },
      },
      {
        $unwind: { path: "$order_info", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            driverId: "$driverId",
            deliveryStatus: "$order_info.deliveryStatus",
          },
          count: { $sum: 1 },
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          totalPayment: { $sum: "$order_info.deliveryPrice" },
        },
      },
      {
        $addFields: {
          ordersDone: {
            $cond: [{ $eq: ["$_id.deliveryStatus", "d"] }, "$count", 0],
          },
        },
      },
      {
        $addFields: {
          incompleteOrders: {
            $cond: [{ $eq: ["$_id.deliveryStatus", "a"] }, "$count", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id.driverId",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          totalPayment: { $sum: "$totalPayment" },
          ordersDone: { $sum: "$ordersDone" },
          incompleteOrders: { $sum: "$incompleteOrders" },
        },
      },
      {
        $project: {
          name: { $concat: ["$firstName", " ", "$lastName"] },
          totalPayment: 1,
          ordersDone: 1,
          incompleteOrders: 1,
          _id: 0,
        },
      },
    ]);
    if(resData) {
        return res.send(new ApiResult(true, resData));
    }
}catch(err){
    return res.send(new ApiResult(false, err.message));
}


})

module.exports = router;