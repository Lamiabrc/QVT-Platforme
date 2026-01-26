precision mediump float;

uniform float uTime;
uniform float uPointSize;
uniform float uGridScale;

varying vec2 vUv;
varying float vTwinkle;

void main() {
  vec3 pos = position;

  // Gentle wobble to keep the grid alive
  float wobble = sin((pos.x + pos.y) * 6.0 + uTime * 1.2) * 0.006;
  pos.z += wobble;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float pulse = 0.15 * sin(uTime * 1.6 + pos.x * 10.0 + pos.y * 8.0);
  float size = uPointSize * (1.0 + pulse);
  gl_PointSize = size;

  vUv = pos.xy * 0.5 + 0.5;
  vTwinkle = pulse;
}
