import {
  Store,
  ShoppingCart,
  Boxes,
  PackageCheck,
  Truck,
  Users,
  ChartNoAxesCombined,
  Building2,
  MapPin,
  Package,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { nodes, copy, flow, pair, type BilingualText } from "../content";
import { BilingualBlock } from "./BilingualBlock";
import { RootMark } from "./Primitives";
const icons = [
  Store,
  ShoppingCart,
  Boxes,
  PackageCheck,
  Truck,
  Users,
  ChartNoAxesCombined,
];
const positions = [
  [17, 30],
  [83, 30],
  [30, 49],
  [70, 49],
  [16, 72],
  [84, 72],
  [50, 88],
];
export function RootNetwork({
  active = 0,
  small = false,
}: {
  active?: number;
  small?: boolean;
}) {
  return (
    <div
      className={`root-network ${small ? "small-network" : ""}`}
      aria-hidden="true"
      data-active-path={active}
    >
      <div className="diagram-coordinate coord-start">J / 01</div>
      <div className="diagram-coordinate coord-end">
        <BilingualBlock inline text={copy.rootSystem} />
      </div>
      <svg
        className="root-paths"
        viewBox="0 0 620 640"
        fill="none"
        focusable="false"
      >
        <g className="root-guides">
          <path d="M310 0V640M0 320H620" />
          <circle cx="310" cy="320" r="232" />
          <circle cx="310" cy="320" r="155" />
        </g>
        <g className="network-lines">
          <path
            data-path="0"
            d="M310 73V126Q310 148 280 148H135Q105 148 105 174V192M310 148H485Q515 148 515 174V192"
          />
          <path
            data-path="1"
            d="M105 218V264Q105 282 132 282H166Q186 282 186 303M515 218V264Q515 282 485 282H207Q186 282 186 303M186 337H434"
          />
          <path
            data-path="2"
            d="M186 339V397Q186 422 162 422H120Q99 422 99 446M434 339V397Q434 422 460 422H501Q521 422 521 446"
          />
          <path
            data-path="3"
            d="M99 478V501Q99 521 130 521H289Q310 521 310 545M521 478V501Q521 521 490 521H310"
          />
          <path data-path="4" d="M310 581V640" />
        </g>
      </svg>
      <div className="network-business">
        <RootMark />
        <BilingualBlock text={copy.business} />
      </div>
      {nodes.map((node, i) => {
        const Icon = icons[i];
        return (
          <div
            className={`network-node node-${node.id}`}
            key={node.id}
            style={
              {
                "--node-x": `${positions[i][0]}%`,
                "--node-y": `${positions[i][1]}%`,
              } as React.CSSProperties
            }
          >
            <Icon size={20} />
            <BilingualBlock text={node} />
            <span className="node-port" />
          </div>
        );
      })}
      <div className="diagram-bottom">
        <span className="connection-dot" />
        <BilingualBlock inline text={copy.rootLabel} />
      </div>
    </div>
  );
}
export function LedgerDiagram() {
  return (
    <figure className="ledger-diagram">
      <div className="diagram-label">
        <Building2 size={18} />
        <BilingualBlock inline text={copy.business} />
      </div>
      <div className="ledger-stores">
        {[copy.storeA, copy.storeB].map((store, i) => (
          <div className={`ledger-column ledger-${i}`} key={store.id}>
            <div className="ledger-store">
              <Store size={23} />
              <BilingualBlock text={store} />
            </div>
            <div className="ledger-track" aria-hidden="true" />
            <div className="ledger-book">
              <span className="ledger-id">{i === 0 ? "A" : "B"}</span>
              <BilingualBlock text={i === 0 ? copy.ledgerA : copy.ledgerB} />
              <div className="ledger-rules" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="shared-location">
        <MapPin size={20} />
        <BilingualBlock inline text={copy.location} />
      </div>
      <figcaption>
        <BilingualBlock text={copy.ledgerNote} />
      </figcaption>
    </figure>
  );
}
export function InventoryDiagram() {
  return (
    <figure className="inventory-diagram">
      <div className="diagram-label">
        <Boxes size={20} />
        <BilingualBlock inline text={nodes[2]} />
      </div>
      <ol>
        {flow.map((step, i) => (
          <li className="inventory-flow-node" key={step.id}>
            <span className="flow-number">0{i + 1}</span>
            <BilingualBlock text={step} />
            <span className="flow-connection" aria-hidden="true" />
          </li>
        ))}
      </ol>
      <figcaption>
        <BilingualBlock
          text={pair(
            "inventory-equivalent",
            "Receive into a Store ledger, reserve for orders, consume on sale, and assemble components into finished stock.",
            "استلم في دفتر مخزون المتجر، واحجز للطلبات، واستهلك عند البيع، وجمّع المكونات إلى مخزون نهائي.",
          )}
        />
      </figcaption>
    </figure>
  );
}
const surfaceLabels = [
  pair("catalogue-visual", "Catalog", "الكتالوج"),
  pair("variants-visual", "Variants", "تركيبات المنتج"),
  pair("stock-visual", "Store ledger", "دفتر مخزون المتجر"),
];
export function CatalogDiagram() {
  return (
    <div className="catalog-diagram" aria-hidden="true">
      {surfaceLabels.map((text, i) => (
        <div className="catalog-stage" key={text.id}>
          <span className="stage-index">0{i + 1}</span>
          {i === 0 ? (
            <Package size={25} />
          ) : i === 1 ? (
            <Link2 size={25} />
          ) : (
            <Boxes size={25} />
          )}
          <BilingualBlock text={text} />
          {i === 1 && (
            <div className="variant-marks">
              <i />
              <i />
              <i />
              <i />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export function IdentityDiagram() {
  return (
    <div className="identity-diagram" aria-hidden="true">
      <RootMark />
      <div className="identity-branches">
        <div>
          <Store size={24} />
          <BilingualBlock text={copy.storeA} />
        </div>
        <div>
          <Store size={24} />
          <BilingualBlock text={copy.storeB} />
        </div>
      </div>
      <ShieldCheck size={22} />
      <BilingualBlock text={copy.stock} />
    </div>
  );
}
export function MiniFlow({ steps }: { steps: BilingualText[] }) {
  return (
    <div className="mini-flow" aria-hidden="true">
      {steps.map((text, i) => (
        <div key={text.id}>
          <span>0{i + 1}</span>
          <BilingualBlock text={text} />
        </div>
      ))}
    </div>
  );
}
