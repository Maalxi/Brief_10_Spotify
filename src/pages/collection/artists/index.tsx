import Head from 'next/head'
import ArtistItem from '../../../components/ArtistItem/ArtistItem'
import Section from '../../../components/Section/Section'
import { artists } from '../../../data/dummy'
import CollectionLayout from '../../../layouts/CollectionLayout'

const Artists = () => {
    return (
        <>
            <Head>
                <title>Psotify - Library</title>
                <meta property="og:title" title="Psotify - Library" key="title" />
            </Head>
            <Section title='Artists'>
                {artists.map((item, key) => (
                    <ArtistItem key={key} {...item} />
                ))}
            </Section>
        </>
    )
}

Artists.PageLayout = CollectionLayout;

export default Artists