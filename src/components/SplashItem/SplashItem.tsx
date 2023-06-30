import { createStyles, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import Image from "next/image";
import React, { FunctionComponent, useEffect, useState } from "react";
import PlayButton from "../PlayButton/PlayButton";
import FastAverageColor from "fast-average-color";
import { MediaItem } from "../../models/MediaItem";
import { useAppSelector } from "../../store/hooks";
import { selectPlaying } from "../../store/features/nowPlaying.slice";

const fac = new FastAverageColor();

type SplashItemProps = MediaItem & {
  artist: any; // Nouveau prop pour l'artiste
  emitAvgColor: (color: string) => void;
};

const useStyles = createStyles({
  wrapper: {
    backgroundColor: "hsla(0,0%,100%,.1)",
    transition: "background-color .3s ease",

    "&:hover": {
      backgroundColor: "hsla(0,0%,100%,.2)",
    },
  },
  imgWrapper: {
    minWidth: "80px",
    minHeight: "80px",
    boxShadow: "0 8px 24px rgb(0 0 0 / 50%)",
  },
});

const SplashItem: FunctionComponent<SplashItemProps> = ({
  artist,
  ...item
}) => {
  const { classes, cx } = useStyles();
  const { hovered, ref } = useHover();
  const { playing, id: playingId } = useAppSelector(selectPlaying);
  const [avgColor, setAvgColor] = useState("");

  useEffect(() => {
    fac.getColorAsync(artist.image).then((color) => {
      setAvgColor(color.rgba);
    });
  });

  const isPlaying = playing && playingId === artist.id;
  const imageUrl = artist.image;
  const title = artist.name;

  return (
    <div
      ref={ref}
      className={cx(
        classes.wrapper,
        "rounded-md overflow-hidden relative h-20 flex cursor-pointer"
      )}
    >
      <div className={classes.imgWrapper}>
        <Image src={imageUrl} width="80" height="80" alt={title} />
      </div>
      <div className="flex flex-grow text-white justify-between items-center px-4">
        <Text lineClamp={2} size="md" weight={700}>
          {title}
        </Text>
        {(hovered || isPlaying) && <PlayButton {...item} />}
      </div>
    </div>
  );
};

const TopArtists: FunctionComponent = () => {
  const [topArtists, setTopArtists] = useState([]);
  const [gotData, setGotData] = useState(false);
  const accessToken = window.localStorage.getItem("spotify_access_token");

  useEffect(() => {
    if (accessToken && !gotData) {
      fetch("https://api.spotify.com/v1/me/top/artists?limit=6&offset=0", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((response) => response.json())
        .then((data) => {
          const refinedData = data.items.map((item) => ({
            name: item.name,
            image: item.images[0].url,
          }));
          if (topArtists.length == 0) {
            setTopArtists(refinedData);
            setGotData(true);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

    if (!accessToken) {
    return <p>Vous devez être connecté pour voir vos artistes préférés. Veuillez vous connecter.</p>;
  }

  return (
    <>
      {topArtists.map((artist, index) => (
        <SplashItem key={index} artist={artist} />
      ))}
    </>
  );
};

export default TopArtists;
