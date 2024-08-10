// import { PROFILE } from "~/consts"

export const MenuDropDown = () => (
  <div className="dropdown dropdown-end">
    <label tabIndex={0} className="btn btn-circle btn-ghost">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h7"
        ></path>
      </svg>
    </label>
    <ul
      tabIndex={0}
      className="menu dropdown-content menu-lg z-[1] mt-3 w-52 rounded-box bg-base-200 p-2 shadow"
    >
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href={`https://twitter.com/gen_sobunya`} target="_blank">
          Twitter
        </a>
      </li>
      <li>
        <a href="https://www.gensobunya.net/" target="_blank">
          サークルサイト
        </a>
      </li>
    </ul>
  </div>
)
