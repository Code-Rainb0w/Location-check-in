const sendButton = document.getElementById("sendLocationBtn");
const messageBox = document.getElementById("message");
const statusMessage = document.getElementById("statusMessage");

sendButton.addEventListener("click", sendLocation);

function sendLocation() {
    statusMessage.textContent = "Accessing secure location...";

    sendButton.disabled = true;
    sendButton.textContent = "Transmitting...";

    // Check if geolocation is supported
    if (!navigator.geolocation) {
        statusMessage.textContent =
            "Location services are not supported on this device.";

        resetButton();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        locationSuccess,
        locationError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function locationSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const userMessage = messageBox.value.trim();

    // Apple Maps link
    const mapsLink =
        `https://maps.apple.com/?q=Jake%27s%20Location&ll=${latitude},${longitude}`;

    // Build text message
    const alertText =
        `📍 Check In Alert\n\n` +
        `Message: ${userMessage || "No message provided"}\n\n` +
        `Location:\n${mapsLink}\n\n` +
        `GPS Accuracy: ±${Math.round(accuracy)} meters`;

    console.log(alertText);

    statusMessage.textContent =
        "Location acquired. Preparing secure transmission...";

    // Replace with YOUR phone number
    const phoneNumber = "425-534-0476";

    // Open SMS app with prefilled message
    window.location.href =
        `sms:${phoneNumber}?body=${encodeURIComponent(alertText)}`;

    resetButton();
}

function locationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            statusMessage.textContent =
                "Location permission was denied.";
            break;

        case error.POSITION_UNAVAILABLE:
            statusMessage.textContent =
                "Unable to determine location.";
            break;

        case error.TIMEOUT:
            statusMessage.textContent =
                "Location request timed out.";
            break;

        default:
            statusMessage.textContent =
                "An unexpected error occurred.";
    }

    resetButton();
}

function resetButton() {
    sendButton.disabled = false;
    sendButton.textContent = "Transmit Location";
}
