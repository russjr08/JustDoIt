function addItem() {
	AuthLib.checkTokens();
	document.querySelector('#add-dialog').toggle();

}

function addDemoItem() {
    document.querySelector('#add-dialog').toggle();
}
