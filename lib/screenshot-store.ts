export function buildScreenshotPublicId(repoName: string): string {
  return `portfolio/${repoName.toLowerCase()}`;
}

export function buildCloudinaryDeliveryUrl(
  cloudName: string,
  publicId: string,
  version?: number
): string {
  const versionSegment = version ? `v${version}/` : "";
  const transformSegment = "f_auto,q_auto,dpr_auto,c_fill,g_auto,w_1200,h_600";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformSegment}/${versionSegment}${publicId}.png`;
}
