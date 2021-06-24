import "./App.scss";

import React, { useRef, useEffect } from "react";

export default function Track ({ track, participant }) {
	const ref = useRef();
	useEffect(() => {
		console.count("track running with ", track);
		if (track !== null) {
			const child = track.attach();
			// console.log("this is child---", child);
			if (track.kind === "video") {
				child.id = participant.identity;
			}
			ref.current.classList.add(track.kind);

			ref.current.appendChild(child);
		}
	}, []);
	return <div className="track flex justify-center flex-col items-center" ref={ref} />;
}
