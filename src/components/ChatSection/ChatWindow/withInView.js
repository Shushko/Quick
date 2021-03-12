import React from 'react';
import { InView } from 'react-intersection-observer';

export const withInView = (Component, callback, key) => {
    return (
        <InView as="div" onChange={ (inView, entry) => callback(inView, entry) } key={ key }>
            { Component }
        </InView>
    )
};