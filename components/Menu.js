import React from "react";
import { IoLogoLinkedin, IoLogoTwitter } from "react-icons/io";
import { IoLogoInstagram } from "react-icons/io";
import { useIntl, createIntl, createIntlCache } from "react-intl";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

import styles from "../styles/menu.module.scss";
import * as locales from "../content/locale";
import formatJsxMessage from "../utils/formatJsxMessage";

import gsap from "gsap";

const intlCache = createIntlCache();

export default function Menu({ backgroundColor, textAnimationControls }) {
  const router = useRouter();
  const { locale, pathname } = router;

  const otherLocale = locale === "en-US" ? "ar" : "en-US";

  const intl = useIntl();
  const [otherIntl, setOtherIntl] = React.useState();

  React.useEffect(() => {
    router.prefetch(`/${otherLocale}${pathname}`);
  }, []);

  React.useEffect(() => {
    const localeCopy = locales[otherLocale];
    setOtherIntl(
      createIntl(
        {
          locale: otherLocale,
          messages: Object.assign(localeCopy["shared"], localeCopy[pathname]),
        },
        intlCache
      )
    );
  }, [locale]);

  const f = (id, options) =>
    formatJsxMessage(intl, locale, id, {
      shouldFade: true,
      animationControls: textAnimationControls,
      ...options,
    });
  const otherF = (id, options) =>
    formatJsxMessage(otherIntl, otherLocale, id, {
      shouldFade: true,
      animationControls: textAnimationControls,
      ...options,
    });

  const [hoveredLink, setHoveredLink] = React.useState("");

  // State used to avoid oddly appearing transition when switching languages
  const [logoTransition, setLogoTransition] = React.useState({ duration: 2 });

  const buildTiltedSquare = (linkName) => {
    let filter;
    if (router.pathname === "/services" || router.pathname === "/blog")
      filter =
        "invert(92%) sepia(72%) saturate(682%) hue-rotate(329deg) brightness(96%) contrast(103%)";
    else
      filter =
        "invert(99%) sepia(59%) saturate(426%) hue-rotate(169deg) brightness(112%) contrast(100%)";

    return (
      <object
        data='/Tilted Square.svg'
        className={styles.tiltedSquare}
        style={{ filter }}
        hidden={hoveredLink !== linkName && `/${linkName}` !== router.pathname}
      />
    );
  };

  const handleAnimation = React.useCallback((locale) => {
    gsap.fromTo(
      `.bg-animation-${pathname.split("/")[1]}`,
      { opacity: 0 },
      { opacity: 1, delay: 1.5 }
    );
    if (!locale || locale.includes("en-US")) {
      gsap.to(`.test-${pathname.split("/")[1]}`, { left: 0 });
    } else {
      gsap.to(`.test-${pathname.split("/")[1]}`, { right: 0 });
    }
    if (!locale || locale.includes("en-US")) {
      gsap.fromTo(
        `.test-${pathname.split("/")[1]}`,
        {
          opacity: 1,
          x: 0,
          right: 0,
          width: "100%",
        },
        {
          opacity: 1,
          x: 100,
          left: 0,
          width: "72%",
          duration: 1.2,
        }
      );
    } else {
      gsap.fromTo(
        `.test-${pathname.split("/")[1]}`,
        {
          opacity: 1,
          x: 0,
          left: 0,
          width: "100%",
        },
        {
          opacity: 1,
          x: -100,
          right: 0,
          width: pathname === "/portfolio" ? "78%" : "75%",
          duration: 1.2,
        }
      );
    }
  }, []);

  return (
    <motion.div
      layoutId='menuLayout'
      className={styles.sidenav + " navbar"}
      transition={{duration: 0.6}}
      style={{
        // backgroundColor: '#f8d952'
        backgroundColor
      }}
    // layout='position'
    >
      {" "}
      <div className='animationFade'>
        <Link href='/'>
          <motion.img
            src='https://i.imgur.com/HjDbXtR.png'
            alt='Mauzoun logo'
            className={styles.logo}
          // transition={logoTransition}
            layoutId="imageLogo"
            // layoutId="logo"
          />
        </Link>

        <div className={styles.menu}>
          <div>
            {["home", "story", "services", "portfolio", "blog", "andyou"].map(
              (e, i) => (
                <div key={e}>
                  {!(i % 2) && buildTiltedSquare(e)}

                  <Link href={"/" + e}>
                    <a
                      className={styles.navLink}
                      onMouseEnter={() => setHoveredLink(e)}
                      onMouseLeave={() => setHoveredLink("")}
                    >
                      <div
                        className={`${styles.itemTitle} heading`}
                        style={{
                          fontWeight: locale === "en-US" ? "500" : "bold",
                        }}
                      >
                        {f(e + "Link")}
                        {i % 2 ? buildTiltedSquare(e) : null}
                      </div>

                      <span
                        className={`${styles.otherLocaleLink} ${otherLocale} lighter`}
                      >
                        {otherF(e + "Link")}
                      </span>
                    </a>
                  </Link>
                </div>
              )
            )}
          </div>

          <div className={styles.languageSwitch}>
            <p className={locale}>
              <b>{locale === "en-US" ? "English" : "العربية"}</b>
            </p>

            <a
              onClick={async (e) => {
                e.preventDefault();
                await textAnimationControls?.start("hidden");
                setLogoTransition({ duration: 0.1 });
                Cookies.set("NEXT_LOCALE", otherLocale);
                router.push(pathname, pathname, { locale: otherLocale });
                await textAnimationControls?.start("visible");
                //TODO : uncomment this part of code to enable animation
                // handleAnimation(locale);
              }}
            >
              <label className={styles.switch}>
                <input type='checkbox' checked={locale === "ar"} readOnly />
                <span className={styles.slider} />
              </label>
            </a>

            <p className={otherLocale}>
              {locale === "ar" ? "English" : "العربية"}
            </p>
          </div>

          <div className={styles.complementaryInfo}>
            <div className={styles.bottomNavIcons}>
              <a target='_blank' href='https://twitter.com/mauzoun_?lang=en'>
                <IoLogoTwitter size='30px' />
              </a>
              <a
                target='_blank'
                href='https://www.instagram.com/mauzoun/?hl=en'
              >
                <IoLogoInstagram size='30px' />
              </a>
              <a
                target='_blank'
                href='https://www.linkedin.com/company/mauzoun/about/'
              >
                <IoLogoLinkedin size='30px' />
              </a>
            </div>

            <span className='en-US'>{f("email")}</span>
            <span className='bolder'>{f("location")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
