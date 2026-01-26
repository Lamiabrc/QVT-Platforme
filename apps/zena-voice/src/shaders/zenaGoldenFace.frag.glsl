precision mediump float;

uniform sampler2D uFaceTexture;
uniform float uTime;
uniform float uThreshold;
uniform vec3 uColorLight;
uniform vec3 uColorDark;
uniform float uOpacity;

varying vec2 vUv;
varying float vTwinkle;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec4 face = texture2D(uFaceTexture, vUv);
  float brightness = dot(face.rgb, vec3(0.299, 0.587, 0.114));

  // Soft mask from face texture
  float faceMask = smoothstep(uThreshold, uThreshold + 0.18, brightness);

  // Circular falloff for point sprite
  vec2 centered = gl_PointCoord - vec2(0.5);
  float dist = length(centered);
  float circle = smoothstep(0.52, 0.0, dist);

  float sparkle = 0.06 * sin(uTime * 2.2 + vUv.y * 12.0 + hash(vUv) * 6.2831);
  vec3 base = mix(uColorDark, uColorLight, clamp(brightness * 1.2, 0.0, 1.0));
  vec3 color = base + sparkle + vTwinkle * 0.4;

  float alpha = faceMask * circle * clamp(brightness * 1.35, 0.0, 1.0) * uOpacity;

  if (alpha < 0.02) discard;
  gl_FragColor = vec4(color, alpha);
}
