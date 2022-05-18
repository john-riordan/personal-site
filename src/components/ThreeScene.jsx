import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Scene() {
	const [hovered, setHovered] = useState(false);

	return (
		<div id="root">
			<div style={{ width: 50, height: 50, background: red }} />
		</div>
	);

	return (
		<div id="root">
			{/* <Canvas flat linear shadows> */}
			<Canvas>
				<color attach="background" args={['#ffbb33']} />
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[-10, -10, -10]} />
				<mesh
					position={[-1.2, 0, 0]}
					onPointerOver={(event) => setHovered(true)}
					onPointerOut={(event) => setHovered(false)}
				>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
				</mesh>
				<OrbitControls />
			</Canvas>
		</div>
	);
}

export default Scene;
