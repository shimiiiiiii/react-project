import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title }) => {
    return (
        <Helmet>
            <title>{`${title} - Donut`}</title>
        </Helmet>
    )
}

export default Meta