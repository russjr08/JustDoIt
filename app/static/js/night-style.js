var hr = (new Date()).getHours(); //get hours of the day in 24Hr format (0-23)
var bootstrap_dark = STATIC_URL + "style/bootstrap-dark.min.css";

if(hr >= 18 || hr <= 7) {
    console.log("It's night time! Turning on dark bootstrap.");
    $('head').append('<link rel="stylesheet" type="text/css" href="' + bootstrap_dark + '">');
} else {
    console.log("Oh hey, it's day time! We'll leave the style as-is.");
}