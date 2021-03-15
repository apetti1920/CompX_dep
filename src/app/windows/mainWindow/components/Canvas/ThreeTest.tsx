// @flow
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {Canvas, useFrame, useThree} from "react-three-fiber";
import * as THREE from "three";
import {linearInterp} from "../../../../../electron/utils";


const Camera = () => {
    const camera = useRef()
    const { aspect, size, setDefaultCamera } = useThree()
    const pixelToThreeUnitRatio = 1
    const planeDistance = 0
    const cameraDistance = 500
    const distance = cameraDistance - planeDistance
    const height = size.height / pixelToThreeUnitRatio
    const halfFovRadians = Math.atan((height / 2) / distance)
    const fov = 2 * halfFovRadians * (180/Math.PI)
    useEffect(() => void setDefaultCamera(camera.current), [])
    return <perspectiveCamera
        ref={camera}
        aspect={aspect}
        fov={fov}
        position={[0, 0, cameraDistance]}
        onUpdate={self => self.updateProjectionMatrix()}
    />
}


function Dots() {
    const ref = useRef()
    useLayoutEffect(() => {
        const transform = new THREE.Matrix4()
        for (let i = 0; i < 10000; ++i) {
            const x = (i % 100) - 50
            const y = Math.floor(i / 100) - 50
            transform.setPosition(x, y, 0)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref.current.setMatrixAt(i, transform)
        }
    }, [])

    return (
        <instancedMesh ref={ref} args={[null, null, 10000]} onWheel={handleScroll} >
            <circleBufferGeometry args={[0.05]} />
            <meshBasicMaterial />
        </instancedMesh>
    )
}


export function ThreeTest(): React.ReactElement {
    return (
        <Canvas colorManagement={false}>
            <Camera/>
            <Dots/>
        </Canvas>
    )
}
