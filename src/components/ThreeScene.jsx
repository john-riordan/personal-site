import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import useSpline from '@splinetool/r3f-spline';

function Scene() {
	const { nodes } = useSpline('https://prod.spline.design/uiTFhY9mQu0KevuO/scene.splinecode');

	return (
		<div id="root">
			<Canvas>
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[-10, -10, -10]} />
				<color attach="background" args={['#54585d']} />
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[-10, -10, -10]} />
				<mesh position={[-1.2, 0, 0]}>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial color={'hotpink'} />
				</mesh>
				<OrbitControls />
			</Canvas>
		</div>
	);
}

export default Scene;
