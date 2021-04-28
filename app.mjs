import createServer from "node-web";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function serveWeb({ port, rfuncAddress, rfuncPort, onCreate }) {
	createServer({
		port,
		onCreate({ addFile, addHandledFile, addPackage, addModuleFile, serve, httpServer }) {
			addHandledFile("/", path.join(__dirname, "/client_dist/index.html"), (req, content, res) => {
				res.send(content);
			});
			addFile("/favicon.ico", path.join(__dirname, "/client_dist/favicon.ico"));
			addModuleFile("/index.mjs", path.join(__dirname, "/client_dist/index.mjs"), (req, content, res) => {
				if (rfuncPort) {
					content = content.replace("const RFUNC_PORT = 3350;", `const RFUNC_PORT = ${JSON.stringify(rfuncPort)};`);
				}
				if (rfuncAddress) {
					content = content.replace("const RFUNC_ADDRESS = undefined;", `const RFUNC_ADDRESS = ${JSON.stringify(rfuncAddress)};`);
				}
				res.send(content);
			}, () => {
				addModuleFile("/io_client_media", path.join(__dirname, "./node_modules/rfunc-ws/ws_client_media.mjs"));
				addPackage("rfunc", "./node_modules/rfunc", () => {
					serve(() => {
						onCreate({ httpServer });
					});
				});
			});
		}
	});
}
