const server = "http://localhost:3000";

window.onload = () => {
	const button = document.getElementsByTagName("button")[0];
	const span = document.getElementsByTagName("span")[0];

	button.addEventListener("click", async (e) => {
		const URL = document.getElementsByTagName("input")[0].value;

		// send link to server and get back a shortened link
		const data = { URL };

		const returnedData = await sendLink(data);

		// check if link was valid
		if (returnedData) {
			span.innerText = `Shortened link: ${window.location.href}url/${returnedData.hash}`;
		} else {
			span.innerText = "Invalid link!";
		}
	});
};

async function sendLink(data) {
	return await fetch(`${server}/post_link`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error("Error:", error);
		});
}
