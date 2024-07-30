'use client';
import { useGlobalContext } from '@/app/context/store';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

export default function TopNavbar({ bannerNavbarItems, contactInfo }) {
  const [activeTopNavbarItem, setActiveTopNavbarItem] = useState('');
  const [toggleOn, setToggleOn] = useState(false);
  const [isTokenExisting, setIsTokenExisting] = useState(false);
  const { globalStore, setGlobalStore } = useGlobalContext();
  const [activeAccordion, setActiveAccordion] = useState('');
  console.log(activeTopNavbarItem)
  useEffect(() => {
    if (globalStore) {
      setIsTokenExisting(globalStore.userToken ? true : false);
    }
  }, [globalStore]);

  const NavbarItem = ({ eachBannerItem, forMobile, indexId }) => {
    const handleClick = () => {
      if (forMobile && eachBannerItem.dropdown) {
        setActiveTopNavbarItem(
          activeTopNavbarItem === eachBannerItem.name ? '' : eachBannerItem.name
        );
      }
    };

    const handleMouseOver = () => {
      if (!forMobile && eachBannerItem.dropdown) {
        setActiveTopNavbarItem(eachBannerItem.name);
      }
    };

    const handleAccordionClick = () => {
      setActiveAccordion(
        activeAccordion === eachBannerItem.name ? '' : eachBannerItem.name
      );
    };

    return (
      <section>
        {eachBannerItem.name !== 'Contact' ? (
          <>
            <li
              onClick={handleClick}
              onMouseOver={handleMouseOver}
              className={`${eachBannerItem.name === 'Categories' ? 'xl:hidden' : ''} transition duration-500 h-[40px] flex items-center px-4  hover:bg-[#000] cursor-pointer tracking-[0.16px]`}
            >
              {eachBannerItem.name !== 'Contact' ? (
                eachBannerItem.name
              ) : (
                <Link href={'/pages/contact'}>
                  <span className="px-0!">Contact</span>
                </Link>
              )}
              {eachBannerItem.dropdown && (
                <svg
                  className={`ml-[10px] transition duration-300 ${activeTopNavbarItem === eachBannerItem.name ? 'rotate-180' : ''}`}
                  width="11"
                  height="7"
                  viewBox="0 0 11 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.18005 6.18895L10.1788 1.08599L9.48613 0L5.08697 4.49197L0.687798 0L-1.93976e-09 1.08599L4.99879 6.18895L5.07227 6.30395L5.09187 6.28395L5.11146 6.30395L5.18005 6.18895Z"
                    fill="white"
                  />
                </svg>
              )}
            </li>
            <hr className="border-gray-300 xl:hidden mx-4 my-1" />
          </>
        ) : (
          <li
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            className={`${eachBannerItem.name === 'Categories' ? 'lg:hidden' : ''} transition duration-300 h-[40px] lg:hover:pr-5 flex items-center hover:bg-[#000] cursor-pointer tracking-[0.16px]`}
          >
            {eachBannerItem.name !== "Contact" ? eachBannerItem.name : <Link href={"/pages/contact"}><span className='px-4 lg:pl-5 lg:pr-0' >Contact</span></Link>}
          </li>)}
      </section>
    );
  };

  return (
    <>
      <nav
        onMouseLeave={() => setActiveTopNavbarItem('')}
        className="bg-[#8A1E41] h-[40px] px-4 sm:px-[10px] lg:px-[50px] xl:px-[20px]"
      >
        <div className="flex items-center container mx-auto">
          <div className="flex items-center">
            <Link
              className="mr-2"
              target="_blank"
              href={
                contactInfo?.social_media_links?.fb_link
                  ? contactInfo?.social_media_links?.fb_link
                  : ''
              }
            >
              <svg
                width="11"
                height="20"
                viewBox="0 0 11 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.76073 3.32083H10.7174V0.140833C10.3798 0.0975 9.21886 0 7.8668 0C5.04568 0 3.11314 1.65583 3.11314 4.69917V7.5H0V11.055H3.11314V20H6.93V11.0558H9.91722L10.3914 7.50083H6.92911V5.05167C6.93 4.02417 7.22649 3.32083 8.76073 3.32083Z"
                  fill="white"
                />
              </svg>
            </Link>
            <Link
              className="mx-2"
              target="_blank"
              href={
                contactInfo?.social_media_links?.insta_link
                  ? contactInfo?.social_media_links?.insta_link
                  : ''
              }
            >
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.0481 0H6.38505C2.86432 0 0 2.67279 0 5.95811V14.0419C0 17.3272 2.86432 20 6.38505 20H15.0481C18.5688 20 21.4331 17.3272 21.4331 14.0419V5.95811C21.4331 2.67279 18.5688 0 15.0481 0ZM19.277 14.0419C19.277 16.2213 17.3836 17.988 15.0481 17.988H6.38505C4.04953 17.988 2.15617 16.2213 2.15617 14.0419V5.95811C2.15617 3.77871 4.04953 2.012 6.38505 2.012H15.0481C17.3836 2.012 19.277 3.77871 19.277 5.95811V14.0419Z"
                  fill="white"
                />
                <path
                  d="M10.7211 4.8291C7.6645 4.8291 5.17773 7.14958 5.17773 10.0018C5.17773 12.854 7.6645 15.1745 10.7211 15.1745C13.7778 15.1745 16.2645 12.854 16.2645 10.0018C16.2645 7.14954 13.7778 4.8291 10.7211 4.8291ZM10.7211 13.1625C8.85041 13.1625 7.33392 11.7474 7.33392 10.0018C7.33392 8.25619 8.85045 6.8411 10.7211 6.8411C12.5918 6.8411 14.1083 8.25619 14.1083 10.0018C14.1083 11.7474 12.5918 13.1625 10.7211 13.1625Z"
                  fill="white"
                />
                <path
                  d="M16.2697 6.10495C17.0033 6.10495 17.598 5.55001 17.598 4.86546C17.598 4.18091 17.0033 3.62598 16.2697 3.62598C15.5361 3.62598 14.9414 4.18091 14.9414 4.86546C14.9414 5.55001 15.5361 6.10495 16.2697 6.10495Z"
                  fill="white"
                />
              </svg>
            </Link>
          </div>
          {/* Toggle Button for Mobile */}
          <button
            onClick={() => {
              if (toggleOn) {
                setToggleOn(false);
                setActiveTopNavbarItem('');
              } else {
                setToggleOn(true);
              }
            }}
            className="ml-auto xl:hidden h-[50px]"
          >
            {!toggleOn ? (
              <>
                <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="18px" height="20px" viewBox="0 0 270.343 270.342" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M45.775,87.412c-24.004,0-43.547-19.533-43.547-43.541c0-24.004,19.542-43.532,43.547-43.532 c24.007,0,43.535,19.527,43.535,43.532C89.31,67.878,69.788,87.412,45.775,87.412z"></path> </g> <g> <path d="M136.307,87.073c-23.992,0-43.535-19.534-43.535-43.538C92.771,19.528,112.314,0,136.307,0 c24.004,0,43.544,19.528,43.544,43.535C179.851,67.539,160.311,87.073,136.307,87.073z"></path> </g> <g> <path d="M225.324,87.073c-24.007,0-43.534-19.534-43.534-43.538C181.79,19.528,201.317,0,225.324,0 c24.001,0,43.547,19.528,43.547,43.535C268.871,67.539,249.325,87.073,225.324,87.073z"></path> </g> <g> <path d="M45.006,178.462c-24.004,0-43.535-19.539-43.535-43.537c0-24.011,19.531-43.535,43.535-43.535 c23.992,0,43.535,19.524,43.535,43.535C88.541,158.923,69.008,178.462,45.006,178.462z"></path> </g> <g> <path d="M135.55,178.126c-24.004,0-43.547-19.54-43.547-43.538c0-24.007,19.543-43.535,43.547-43.535 s43.531,19.528,43.531,43.535C179.081,158.586,159.554,178.126,135.55,178.126z"></path> </g> <g> <path d="M225.324,178.126c-24.007,0-43.534-19.54-43.534-43.538c0-24.007,19.527-43.535,43.534-43.535 c24.001,0,43.547,19.528,43.547,43.535C268.871,158.586,249.325,178.126,225.324,178.126z"></path> </g> <g> <path d="M45.775,270.342c-24.004,0-43.547-19.534-43.547-43.541s19.542-43.535,43.547-43.535 c24.007,0,43.535,19.528,43.535,43.535S69.788,270.342,45.775,270.342z"></path> </g> <g> <path d="M136.307,270c-23.992,0-43.535-19.527-43.535-43.535c0-24.007,19.543-43.534,43.535-43.534 c24.004,0,43.544,19.527,43.544,43.534C179.851,250.472,160.311,270,136.307,270z"></path> </g> <g> <path d="M225.324,270c-24.007,0-43.534-19.527-43.534-43.535c0-24.007,19.527-43.534,43.534-43.534 c24.001,0,43.547,19.527,43.547,43.534C268.871,250.472,249.325,270,225.324,270z"></path> </g> </g> </g> </g></svg>

              </>
            ) : (
              <>
                <div className="w-5 h-px bg-white transform rotate-45 origin-center"></div>
                <div className="w-5 h-px bg-white transform -rotate-45 origin-center"></div>
              </>
            )}
          </button>
          {/* Main Navbar Items */}
          <ul
            className={`ml-auto hidden xl:flex items-center text-white ${toggleOn ? '' : 'hidden'}`}
          >
            {bannerNavbarItems.map((eachBannerItem, index) => (
              <NavbarItem
                key={index}
                eachBannerItem={eachBannerItem}
                forMobile={false}
                indexId={index}
              />
            ))}
          </ul>
        </div>
        <div className="w-full xl:w-2/3 absolute lg:right-[unset] xl:lg:right-[0px] z-20 overflow-y-hidden">
        <div
          className="bg-[#8A1E41] lg:w-full text-white ml-auto"
        >
          {/* Dropdown Items for Desktop */}
          <ul
            className={`hidden lg:flex flex-wrap transition-all duration-300 ease-in-out ${activeTopNavbarItem != '' ? 'h-fit p-5' : 'p-0'}`}
          >
            {bannerNavbarItems
              .filter((each) => each.name === activeTopNavbarItem)[0]
              ?.dropdownValues?.sort((a, b) => a.name.localeCompare(b.name))?.map((item, index) => (
                <li
                  key={index}
                  className={`w-2/3 md:w-1/3 lg:w-1/4 ${activeTopNavbarItem != '' ? 'p-2' : 'p-0'}`}
                >
                  <Link
                    onClick={() => setActiveTopNavbarItem('')}
                    href={`/category/${activeTopNavbarItem.toLowerCase()}/${item.slug}/${item.id}`}
                  >
                    <span className="hover:bg-[#000] cursor-pointer p-2">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
      </nav>
      {/* Accordion for Mobile */}
      <div className="w-full absolute lg:right-[unset] xl:lg:right-[0px] z-20 overflow-y-hidden">
        <div
          className="bg-[#8A1E41] lg:w-full xl:w-2/3 text-white ml-auto"
        >
          <ul
            className={`ml-auto xl:hidden transition-all duration-400 text-white ${toggleOn ? 'h-screen overflow-scroll' : 'h-0'}`}
          >
            {/* <hr className="border-gray-300 xl:hidden mx-4" /> */}
            {bannerNavbarItems.map((eachBannerItem, index) => (
              <Fragment key={index}>
                <NavbarItem
                  key={index}
                  eachBannerItem={eachBannerItem}
                  forMobile={true}
                />
                {activeTopNavbarItem === eachBannerItem.name && <>
                  <ul className="flex xl:hidden flex-col pt-0 p-4 transition-all duration-1000 h-48 overflow-y-auto">
                    {bannerNavbarItems
                      .filter((each) => each.name === activeTopNavbarItem)[0]
                      .dropdownValues?.map((item, index) => (
                        <li
                          key={index}
                          className="w-full p-2 "
                        >
                          <Link
                            onClick={() => {
                              setActiveTopNavbarItem('');
                              setToggleOn(false);
                            }}
                            href={`/category/${activeTopNavbarItem.toLowerCase()}/${item.slug}/${item.id}`}
                          >
                            <span className="hover:bg-[#000] cursor-pointer tracking-[0.16px]">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                  <hr className="border-gray-300 xl:hidden mx-4 my-1" />
                </>}
              </Fragment>
            ))}
            <hr className="border-gray-300 xl:hidden mx-4 my-1" />
            {isTokenExisting && (
              <Link
                onClick={() => {
                  setActiveTopNavbarItem('');
                  setToggleOn(false);
                }}
                href={isTokenExisting ? `/user/logout` : '/user/login'}
              >
                <li className="transition duration-300 h-[40px] flex items-center px-4 hover:bg-[#000] cursor-pointer">
                  {isTokenExisting ? `Logout` : 'Login'}
                </li>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
