const server = "http://localhost:3000";

window.onload = () => {
	const button = document.getElementsByTagName("button")[0];
	const span = document.getElementsByTagName("span")[0];

	button.addEventListener("click", async (e) => {
		const URL = document.getElementsByTagName("input")[0].value;

		// send link to server and get back shortened link
		const data = { URL: URL };

		const returnedData = await fetch(`${server}/post_link`, {
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

		span.innerText = `Shortened link: ${window.location.href}${returnedData._id}`;
	});
};
