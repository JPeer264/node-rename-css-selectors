/* eslint-disable */
// jQuery example
$(".jp-block");

// vanillaJS example
document.getElementsByClassName(" jp-block__element");
document.getElementById("jp-block__element--modifier");

const restSpread = {
    weirdFormatting: true,
shouldRest: true,
  };

const extended = { ...restSpread };
const { ...options } = extended;
