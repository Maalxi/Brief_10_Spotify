import Head from 'next/head'
import CollectionLayout from '../../../layouts/CollectionLayout';

const Podcasts = () => {
    return (
        <>
            <Head>
                <title>Psotify - Library</title>
                <meta property="og:title" title="Psotify - Library" key="title" />
            </Head>
            <div>Podcasts - WIP</div>
        </>
    )
}

Podcasts.PageLayout = CollectionLayout;

export default Podcasts