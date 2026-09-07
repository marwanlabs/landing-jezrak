import { section, type BilingualText } from "../content";
// Match the published landing policy without exposing its internal-only source text.
export function isPublicDetail(item: BilingualText) {
  return !/restricted Platform Super Admin recovery|Platform operations overview/i.test(
    item.en,
  );
}
export const publicDetails = (id: string) =>
  section(id).details.filter(isPublicDetail);
