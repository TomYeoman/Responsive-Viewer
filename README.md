# Responsive-Viewer
View page layouts in various sizes all through the browser (Designed for use with bootstrap but can be easily customised for use with other frameworks)

"responsive bootstrap viewer" allows users to easily emulate any screen sizes from within your browser without needing to use dev tools

  - Great for showing off responsive views to any non-technical colleagues. 
  - Can come in handy if you are creating a page builder but need to allow the users to view a mobile preview
  - Maybe you just want your containers to fluidly change size after an action is triggered

Examples

	- Live Demo: https://plnkr.co/edit/tZfo6V2WLJWG1giZcY8V?p=preview

	- Download the .zip and Navigate to "/Examples" folder
	
	
Usage

[-HTML-]

	<select class="centerSelect form-control" id="bootstrap-size-selector">
		<option value="760">Extra-Small (Mobile)</option>
		<option value="991">Small (Tablet)</option>
		<option value="1100">Medium (Laptop) </option>
		<option value="1280">Large (Desktop)</option>
		<option selected value="fullscreen">Fullscreen</option>
	</select>

	<div class="resizeable-container"> <!-- resizeable-container is used by bootstrap responsive viewer in order to animate size -->
		<div class="col-xs-12 col-sm-6 col-md-4">
			<input type="text" class="form-control">
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4">
			<input type="text" class="form-control">
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4">
			<input type="text" class="form-control">
		</div>
	</div>


[-Javascript-]


	// Initialise the responsive preview window, Found in "bootstrap_responsive_viewer"
	BOOTSTRAP_VIEWER.init({
		sizeDropdown: "#bootstrap-size-selector",   // This is the ID of your dropdown with all your sizes, It can contain any amount of sizes just give the value of the PX size
		resizeableContainer: ".resizeable-container", // ID / Class of the container you wish to become resizeable
		onlyImitateSmallerScreens: "true", // Allow / Disallow the ability to imitate a screen bigger than your own
		animationSpeed: "1000"	// Speed in MS of animation between sizes
	});
