import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const customStyles = {
	h1: {
		fontSize: "32px",
		color: "purple",
		fontFamily: "Arial, sans-serif",
	},
	h3: {
		fontSize: "25px",
		color: "#BED754",
		fontFamily: "Arial, sans-serif",
	},
	p: {
		fontSize: "17px",
		fontFamily: "Verdana, sans-serif",
		lineHeight: "1.8rem",
		fontWeight: 5,
	},
	strong: {
		fontWeight: "bold",
		// color: "red",
	},
};

const ShowMarkDown = ({ markdown }) => {
	return (
		<ReactMarkdown
			components={{
				h1: ({ node, ...props }) => <h1 style={customStyles.h1} {...props} />,
				h3: ({ node, ...props }) => <h3 style={customStyles.h3} {...props} />,
				p: ({ node, ...props }) => <p style={customStyles.p} {...props} />,
				strong: ({ node, ...props }) => (
					<strong style={customStyles.strong} {...props} />
				),
			}}
			remarkPlugins={[remarkGfm]}
		>
			{markdown}
		</ReactMarkdown>
	);
};

export default ShowMarkDown;
