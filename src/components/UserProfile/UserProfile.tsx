import { createStyles, Menu, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDown, ExternalLink } from "tabler-icons-react";
import { Breakpoint, maxWidth } from "../../utils/breakpoints";
import { useRouter } from "next/router";

const useStyles = createStyles({
  dropdown: {
    backgroundColor: "#282828",
    border: "0",
  },
  item: {
    color: "#fff",
    fontWeight: 600,
  },
});

const UserProfile = () => {
  const sm = useMediaQuery(maxWidth(Breakpoint.sm));
  const [opened, setOpened] = useState(false);
  const { classes, cx } = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  // const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true); // New state
  const router = useRouter();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_user_profile");
    router.push("/");
    location.reload();
  };

  useEffect(() => {
    setLoading(true); // Start loading before the fetch
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    let storedAccessToken = localStorage.getItem("spotify_access_token");
    let storedUserProfile = JSON.parse(
      localStorage.getItem("spotify_user_profile")
    );

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setIsLoggedIn(true);
    }

    if (storedUserProfile) {
      setUserProfile(storedUserProfile);
    }

    if (code && !storedAccessToken) {
      const getAccessToken = async () => {
        const response = await fetch("/api/getAccessToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });
    
        const data = await response.json();
        const accessToken = data.access_token;
    
        setAccessToken(accessToken);
        localStorage.setItem("spotify_access_token", accessToken);
    
        const fetchUserProfile = async () => {
          try {
            const response = await fetch("https://api.spotify.com/v1/me", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setUserProfile(data);
              localStorage.setItem("spotify_user_profile", JSON.stringify(data));
              setIsLoggedIn(true);
            } else {
              setIsLoggedIn(false);
            }
          } catch (error) {
            console.error(error);
            setIsLoggedIn(false);
          }
        };
    
        fetchUserProfile();
      };
    
      getAccessToken().then(() => {
        window.history.pushState({}, null, "/");
      });
    }
    setLoading(false); // Finish loading after the fetch
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="relative z-10">
    <Menu
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      classNames={{
        dropdown: classes.dropdown,
        item: classes.item,
      }}
      transition="pop-top-right"
      shadow="sm"
      width={224}
    >
      <Menu.Target>
        {isLoggedIn ? (
          <div
            className={cx(
              { "bg-[#282828]": opened },
              "text-white bg-black bg-opacity-70 cursor-pointer hover:bg-[#282828] h-8 rounded-3xl flex justify-around items-center gap-2"
            )}
          >
            <div className="flex justify-center items-center">
              <Image
                alt="Profile Image"
                className="p-0.5 rounded-full"
                width={28}
                height={28}
                src={
                  userProfile?.images?.[0]?.url ||
                  "https://avatars.dicebear.com/api/jdenticon/xyz.svg"
                }
              />
            </div>
            {!sm && (
              <>
                <Text size="sm" weight="bold">
                  {userProfile.display_name || "John"}
                </Text>
                <div className="mr-2">
                  <ChevronDown size={20} />
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() =>
              (window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:8888/&scope=playlist-read-collaborative playlist-read-private user-library-read user-library-modify user-read-recently-played user-read-private user-top-read user-follow-read
              &state=${router.asPath}`)
            }
          >
            Se connecter
          </button>
        )}
      </Menu.Target>
      {isLoggedIn && (
        <Menu.Dropdown>
          <Menu.Item rightSection={<ExternalLink size={20} />}>
            Compte
          </Menu.Item>
          <Menu.Item>Profil</Menu.Item>
          <Menu.Item>
            <a
              href="https://support.spotify.com/fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between w-full"
            >
              Support
              <ExternalLink size={20} />
            </a>
          </Menu.Item>
          <Menu.Item>
            <a
              href="https://www.spotify.com/ca-fr/download/android/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between w-full"
            >
              Download
              <ExternalLink size={20} />
            </a>
          </Menu.Item>

          <Menu.Item onClick={handleLogout}>Se déconnecter</Menu.Item>
        </Menu.Dropdown>
      )}
    </Menu>
  </div>
      )}
    </>
  );
};

export default UserProfile;
