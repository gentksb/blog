import { PROFILE } from "~/consts"

export const MenuDropDown = () => (
  <div className="dropdown-end dropdown">
    <label tabIndex={0} className="btn btn-circle btn-ghost">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h7"
        ></path>
      </svg>
    </label>
    <ul
      tabIndex={0}
      className="menu dropdown-content rounded-box menu-lg z-[1] mt-3 w-52 bg-base-200 p-2 shadow"
    >
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a
          href={`https://twitter.com/${PROFILE.social.twitter}`}
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <li>
        <a href="https://www.gensobunya.net/" target="_blank">
          サークルサイト
        </a>
      </li>
      <li>
        <a href="https://gensobunya-tech.hatenablog.com/" target="_blank">
          Tech Blog
        </a>
      </li>
    </ul>
  </div>
)
