const sendButton = document.getElementById("sendLocationBtn");
const messageBox = document.getElementById("message");
const statusMessage = document.getElementById("statusMessage");

sendButton.addEventListener("click", sendLocation);

function sendLocation() {
    statusMessage.textContent = "Accessing secure location...";
    sendButton.disabled = true;
    sendButton.textContent = "Transmitting...";

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
    const accuracy = Math.round(position.coords.accuracy);
    const userMessage = messageBox.value.trim();

    statusMessage.textContent =
        "Location acquired. Contacting alert server...";

    sendAlertToTwilio(userMessage, latitude, longitude, accuracy);
}

async function sendAlertToTwilio(userMessage, latitude, longitude, accuracy) {
    const functionUrl =
        "https://hello-messaging-9257-zbs6be.twil.io/hello-messaging";

    try {
        const response = await fetch(functionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                message: userMessage || "No message provided",
                latitude: latitude,
                longitude: longitude,
                accuracy: accuracy
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            statusMessage.textContent =
                "Location transmitted successfully.";

            messageBox.value = "";
        } else {
            statusMessage.textContent =
                "Transmission failed. Check Twilio logs.";

            console.error("Twilio error:", result.error);
        }

    } catch (error) {
        statusMessage.textContent =
            "Unable to contact alert server.";

        console.error("Fetch error:", error);
    }

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
                "An unexpected location error occurred.";
    }

    resetButton();
}

function resetButton() {
    sendButton.disabled = false;
    sendButton.textContent = "Transmit Location";
}