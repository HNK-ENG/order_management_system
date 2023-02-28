const USER_TABLE_HEADS = ["OrderID", "Status", "Item Name", "Quantity", "Total Cost", "Action"]
const ADMIN_TABLE_HEADS = ["OrderID", "CustomerID", "Status", "Item Name", "Quantity", "Total Cost", "Action"]

const ROLES= {
    0:'USER',
    1:'ADMIN',
    2:'SUPER_ADMIN'
  }

const ORDER_PROGRESS = {
    "NEW" : 0,
    // "ACCEPT" : 1,
    // "INPROGRESS" : 2,
    "DISPATCHED" : 3,
    "SUCCESS" : 4,
    "CANCELED" : 5
}

const USER_ACTION_ENABLED_STATUS = {
    "NEW" : "CANCEL",
    "DISPATCHED" : "RECIEVED",
}

const ADMIN_ACTION_ENABLED_STATUS = {
    "NEW" : "DISPATCH",
}

const GetRolesByIDs = function(rolesArray){
    var roles = []
    rolesArray.map(roleIndex => {
        roles.push(ROLES[roleIndex])
    })
    return roles
}

const ToTitleCase = function(str){
    const titleCase = str
        .toLowerCase()
        .split(' ')
        .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');

    return titleCase;
}

const GetUserActionByStatus = function(status){
    switch(status){
        case "NEW" :
            return USER_ACTION_ENABLED_STATUS.NEW
        case "DISPATCHED":
            return USER_ACTION_ENABLED_STATUS.DISPATCHED
        default:
            return null
    }
    
}

const GetAdminActionByStatus = function(status){
    switch(status){
        case "NEW" :
            return ADMIN_ACTION_ENABLED_STATUS.NEW
        default:
            return null
    }
    
}

export {
    USER_TABLE_HEADS, 
    ADMIN_TABLE_HEADS, 
    ROLES, ORDER_PROGRESS, 
    USER_ACTION_ENABLED_STATUS, 
    ADMIN_ACTION_ENABLED_STATUS, 
    GetRolesByIDs, 
    ToTitleCase, 
    GetUserActionByStatus, 
    GetAdminActionByStatus
}