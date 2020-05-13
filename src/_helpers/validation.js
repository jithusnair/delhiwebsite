export function isEmpty(val) {
    return val.trim().length !== 0;
  }
  
export function isValidEmail(val) {
    return new RegExp(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    ).test(val);
}

export function isSecure(val) {
    return val.trim().length >= 8 ;
}

export function isMobile(val) {
    return val.trim().length == 10 && new RegExp(/^[1-9]\d{9}$/).test(val);
}