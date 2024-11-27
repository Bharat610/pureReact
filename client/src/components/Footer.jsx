import React from "react";

export default function Footer() {
  return (
    <footer className="p-5 mt-auto flex bg-gray-200">
      <div className="flex flex-col lg:flex-row gap-2.5 items-center w-full justify-between max-w-screen-desktop mx-auto">
        <p className="text-sm text-gray-600">
          <span className="text-teal font-medium">PureReact</span> - A social
          network for React developers
        </p >
        <p className="text-sm text-gray-600"> Copyright © 2024. Made with love and MERN stack</p>
      </div>
    </footer>
  );
}
