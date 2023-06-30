import Head from 'next/head'
import CollectionLayout from '../../../layouts/CollectionLayout';

const Playlists = () => {
    return (
        <>
            <Head>
                <title>Psotify - Library</title>
                <meta property="og:title" title="Psotify - Library" key="title" />
            </Head>
            <div>Playlists - WIP</div>
        </>
    )
}

Playlists.PageLayout = CollectionLayout;

export default Playlists