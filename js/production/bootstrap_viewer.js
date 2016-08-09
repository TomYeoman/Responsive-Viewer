// Made By	: Tom Yeoman, 03/08/2016
// Usage	: Allows your elements to be put inside a re-sizeable pane so that you can show off mobile views without resizing browser


/*
--- How to use ---

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

*/


let BOOTSTRAP_VIEWER = (function () {

	let animationTimer, animateCount = 0, animateTime = 0, frameCount = 30; // Animation Specific
	let direction = ""; // Direction to animate frame, I.e if our new margin is bigger we will animate "up" adding pixelStep per frame to the oldMargin

	let OldMargin = 0, NewMargin = 0; // Use this to animate between the 2 margins
	let xsSizeArr = [], smSizeArr = [], mdSizeArr = [], lgSizeArr = [], originalClasses = []; // Stores initial list of classes used in each element

	let $resizeableContainer, $sizeDropdown, onlyImitateSmallerScreens = true; // Passed in through config

	init = function (config) {

		$resizeableContainer = $(config.resizeableContainer);
		$sizeDropdown = $(config.sizeDropdown);
		animateTime = config.animationSpeed;

		if (config.onlyImitateSmallerScreens === "false") {
			onlyImitateSmallerScreens;
		}

		_saveColumnSizes(); // On first load we save all the original colum sizes for elements we wish to make responsive
		_setupDropdownListener($sizeDropdown); // Listen to when we change screen size
	}

	let _setupDropdownListener = () => {
		$sizeDropdown.change(function () {
			animateContainer($(this).val());
		})
	}

	let _saveColumnSizes = () => {

		// Find all inputs and create arrays to contain there orignal column sizes
		$resizeableContainer.find('div').each(function () {

			if ($(this).attr('class')) { // if no class attribute exists then line below will error
				let classList = $(this).attr('class').split(/\s+/);
				let xsFound = false, smFound = false, mdFound = false, lgFound = false, additionalFound = false; // If we do not find them then we need to add a blank array entry still
				let tempxsArr = [], tempsmArr = [], tempmdArr = [], templgArr = [], tempAdditionalArr = []; // There may be an array of classes for each element, So create a var to hold this

				classList.map((className) => {

					// If we match on the string "col-xs" then we know we need to save
					if (className.indexOf("col-xs") != -1) {
						tempxsArr.push(className);
						xsFound = true;
					}
					else if (className.indexOf("col-sm") != -1) {
						tempsmArr.push(className);
						smFound = true;
					}
					else if (className.indexOf("col-md") != -1) {
						tempmdArr.push(className);
						mdFound = true;
					}
					else if (className.indexOf("col-lg") != -1) {
						templgArr.push(className);
						lgFound = true;
					}
					else {
						tempAdditionalArr.push(className);
						additionalFound = true;
					}
				});

				// If we've found no bootstrap classes add an empty element
				if (!xsFound) {
					tempxsArr.push("");
				}
				if (!smFound) {
					tempsmArr.push("");
				}
				if (!mdFound) {
					tempmdArr.push("");
				}
				if (!lgFound) {
					templgArr.push("");
				}
				if (!additionalFound) {
					tempAdditionalArr.push("");
				}

				xsSizeArr.push(tempxsArr); // tempxs array could equal [""], Or ["col-xs-3"], Or ["col-xs-offset-2", "col-xs-6"]
				smSizeArr.push(tempsmArr);
				mdSizeArr.push(tempmdArr);
				lgSizeArr.push(templgArr);
				originalClasses.push(tempAdditionalArr);

			} else {

				// If there is no class attribute for the element store empty arr item
				xsSizeArr.push([""]);
				smSizeArr.push([""]);
				mdSizeArr.push([""]);
				lgSizeArr.push([""]);
				originalClasses.push([""]);
			}

		});
	}

	let animateContainer = (dropdown_value) => {

		let actualSize = $resizeableContainer.width();
		let pageSize = $('body').innerWidth();
		let desiredSize = dropdown_value;

		// Go no further if we are trying to imitate larger screen than current
		if (onlyImitateSmallerScreens) {
			if (desiredSize > pageSize) {
				alertModal({
					title: "You cannot imitate a screen bigger than your own",
					type:"warning"
				});

				return;
			}
		}

		// Set the correct desiredSize if we do not pass in a specific px size from the dropdown menu
		if (desiredSize === "fullscreen") {
			desiredSize = pageSize;
		}


		/* Extra small devices (phones, less than 768px) */
		if (desiredSize < 768) {
			$resizeableContainer.find("div").each(function (index) {

				$(this).removeClass(); // Clear all existing classes

				xsSizeArr[index].map((className) => {
					$(this).addClass(className);
				});

				originalClasses[index].map((className) => {
					$(this).addClass(className);
				});

			});
		}

		// Small devices (tablets, 768px and up) 
		else if ((desiredSize > 768) && (desiredSize <992)) {
			$resizeableContainer.find("div").each(function (index) {

				$(this).removeClass(); // Clear all existing classes

				xsSizeArr[index].map((className) => {
					$(this).addClass(className);
				});

				smSizeArr[index].map((className) => {
					$(this).addClass(className);
				});

				originalClasses[index].map((className) => {
					$(this).addClass(className);
				});

			});
		}

		// Medium devices (desktops, 992px and up) 
		else if ((desiredSize > 992) && (desiredSize <1200)) {
				$resizeableContainer.find("div").each(function (index) {
					$(this).removeClass();

					xsSizeArr[index].map((className) => {
						$(this).addClass(className);
					});

					smSizeArr[index].map((className) => {
						$(this).addClass(className);
					});

					mdSizeArr[index].map((className) => {
						$(this).addClass(className);
					});
					originalClasses[index].map((className) => {
						$(this).addClass(className);
					});

				});
		}

		// Large devices (large desktops, 1200px and up)
		else if (desiredSize > 1200) {
			$resizeableContainer.find("div").each(function (index) {

				$(this).removeClass();

				// For large we can add xs upto lg as this will accurately reflect how it would look once published
				xsSizeArr[index].map((className) => {
					$(this).addClass(className);
				});

				smSizeArr[index].map((className) => {
					$(this).addClass(className);
				});

				mdSizeArr[index].map((className) => {
					$(this).addClass(className);
				});

				lgSizeArr[index].map((className) => {
					$(this).addClass(className);
				});

				originalClasses[index].map((className) => {
					$(this).addClass(className);
				});
			});
		}

		// We now adjust margins
		NewMargin = (pageSize - desiredSize) / 2;
		OldMargin = parseInt($resizeableContainer.css("margin-left"));
		let pixelSteps = 0; // Amount of pixels to animate per frame, E.g if margin = 150, Then 150/30 = 3 pixels / frame

		// If the margins we require are smaller than current (We want more margins)
		if (desiredSize < actualSize) {
			let difference = NewMargin - OldMargin;
			pixelSteps = Math.floor(difference / frameCount);
			direction = "down" // Travel "down" in pixels from the OldMargin (e.g oldmArgin = 50, But we want to get to 20)
		}

		if (desiredSize > actualSize) {
			let difference = OldMargin - NewMargin; // E.g Difference of 50
			pixelSteps = Math.floor(difference / frameCount); // E.g 2
			direction = "up" // Travel up from the existing size to get to the new one
		}

		// Clear any previous animation
		clearInterval(animationTimer);
		animateCount = 0;

		// Begin new animation
		animationTimer = setInterval(function () {
			updateContainerSize(pixelSteps)
		}, animateTime / frameCount);

	}

	let updateContainerSize = (pixelSteps) => {

		if (direction == "up") {
			OldMargin = OldMargin - pixelSteps;
			$resizeableContainer.css("margin-left", OldMargin);
			$resizeableContainer.css("margin-right", OldMargin)
		}

		if (direction == "down") {
			OldMargin = OldMargin + pixelSteps;
			$resizeableContainer.css("margin-left", OldMargin);
			$resizeableContainer.css("margin-right", OldMargin)
		}

		animateCount += (animateTime / frameCount)

		if (animateCount > animateTime) {
			clearInterval(animationTimer);
		}
	}

	return {
		init: init
	}

})();

