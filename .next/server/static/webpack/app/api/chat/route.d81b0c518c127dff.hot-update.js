"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/api/chat/route",{

/***/ "(rsc)/./app/api/chat/route.ts":
/*!*******************************!*\
  !*** ./app/api/chat/route.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var ai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ai */ \"(rsc)/./node_modules/ai/dist/index.mjs\");\n\nconst runtime = \"edge\";\nasync function POST(req) {\n    const request = await req.json();\n    const { prompt, projectId, sessionId } = request;\n    // if (projectId === \"git-1782\") {\n    //   // fetch POST https://api.mendable.ai/component/chat {\"question\":\"What are the different types of modules available in the codebase?\",\"history\":[],\"component_version\":\"0.0.151\",\"anon_key\":\"a2b5e9f3-74f0-4810-97f2-fa10fc053cc7\",\"conversation_id\":920050}\n    //   const response = await fetch(`https://api.mendable.ai/component/chat`, {\n    //     method: \"POST\",\n    //     body: JSON.stringify({\n    //       question: prompt,\n    //       history: [],\n    //       component_version: \"0.0.151\",\n    //       anon_key: \"a2b5e9f3-74f0-4810-97f2-fa10fc053cc7\",\n    //       conversation_id: 920050,\n    //     }),\n    //   });\n    //   return new StreamingTextResponse(response.body);\n    // }\n    const response = await fetch(`http://34.93.236.239/api/askdocnavigator`, {\n        method: \"POST\",\n        body: JSON.stringify({\n            projectId: projectId === \"bs-1782\" ? \"880384da-45e6-493e-9de0-f364fb08f09a\" : \"\",\n            query: prompt,\n            sources: true,\n            sessionId\n        })\n    }).then((res)=>{\n        console.log({\n            res\n        });\n        return res;\n    }).catch((err)=>{\n        console.log(err);\n    });\n    console.log(response.body);\n    return new ai__WEBPACK_IMPORTED_MODULE_0__.StreamingTextResponse(response?.body);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NoYXQvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJDO0FBQ3BDLE1BQU1DLFVBQVUsT0FBTztBQUV2QixlQUFlQyxLQUFLQyxHQUFZO0lBQ3JDLE1BQU1DLFVBQVUsTUFBTUQsSUFBSUUsSUFBSTtJQUM5QixNQUFNLEVBQUVDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUUsR0FBR0o7SUFDekMsa0NBQWtDO0lBQ2xDLGlRQUFpUTtJQUNqUSw2RUFBNkU7SUFDN0Usc0JBQXNCO0lBQ3RCLDZCQUE2QjtJQUM3QiwwQkFBMEI7SUFDMUIscUJBQXFCO0lBQ3JCLHNDQUFzQztJQUN0QywwREFBMEQ7SUFDMUQsaUNBQWlDO0lBQ2pDLFVBQVU7SUFDVixRQUFRO0lBQ1IscURBQXFEO0lBQ3JELElBQUk7SUFDSixNQUFNSyxXQUFZLE1BQU1DLE1BQU0sQ0FBQyx3Q0FBd0MsQ0FBQyxFQUFFO1FBQ3hFQyxRQUFRO1FBQ1JDLE1BQU1DLEtBQUtDLFNBQVMsQ0FBQztZQUNuQlAsV0FDRUEsY0FBYyxZQUFZLHlDQUF5QztZQUNyRVEsT0FBT1Q7WUFDUFUsU0FBUztZQUNUUjtRQUNGO0lBQ0YsR0FDR1MsSUFBSSxDQUFDLENBQUNDO1FBQ0xDLFFBQVFDLEdBQUcsQ0FBQztZQUFFRjtRQUFJO1FBQ2xCLE9BQU9BO0lBQ1QsR0FDQ0csS0FBSyxDQUFDLENBQUNDO1FBQ05ILFFBQVFDLEdBQUcsQ0FBQ0U7SUFDZDtJQUNGSCxRQUFRQyxHQUFHLENBQUNYLFNBQVNHLElBQUk7SUFDekIsT0FBTyxJQUFJWixxREFBcUJBLENBQUNTLFVBQVVHO0FBQzdDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2FwcC9hcGkvY2hhdC9yb3V0ZS50cz9kZTQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0cmVhbWluZ1RleHRSZXNwb25zZSB9IGZyb20gXCJhaVwiO1xuZXhwb3J0IGNvbnN0IHJ1bnRpbWUgPSBcImVkZ2VcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBSZXF1ZXN0KSB7XG4gIGNvbnN0IHJlcXVlc3QgPSBhd2FpdCByZXEuanNvbigpO1xuICBjb25zdCB7IHByb21wdCwgcHJvamVjdElkLCBzZXNzaW9uSWQgfSA9IHJlcXVlc3Q7XG4gIC8vIGlmIChwcm9qZWN0SWQgPT09IFwiZ2l0LTE3ODJcIikge1xuICAvLyAgIC8vIGZldGNoIFBPU1QgaHR0cHM6Ly9hcGkubWVuZGFibGUuYWkvY29tcG9uZW50L2NoYXQge1wicXVlc3Rpb25cIjpcIldoYXQgYXJlIHRoZSBkaWZmZXJlbnQgdHlwZXMgb2YgbW9kdWxlcyBhdmFpbGFibGUgaW4gdGhlIGNvZGViYXNlP1wiLFwiaGlzdG9yeVwiOltdLFwiY29tcG9uZW50X3ZlcnNpb25cIjpcIjAuMC4xNTFcIixcImFub25fa2V5XCI6XCJhMmI1ZTlmMy03NGYwLTQ4MTAtOTdmMi1mYTEwZmMwNTNjYzdcIixcImNvbnZlcnNhdGlvbl9pZFwiOjkyMDA1MH1cbiAgLy8gICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5tZW5kYWJsZS5haS9jb21wb25lbnQvY2hhdGAsIHtcbiAgLy8gICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gIC8vICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gIC8vICAgICAgIHF1ZXN0aW9uOiBwcm9tcHQsXG4gIC8vICAgICAgIGhpc3Rvcnk6IFtdLFxuICAvLyAgICAgICBjb21wb25lbnRfdmVyc2lvbjogXCIwLjAuMTUxXCIsXG4gIC8vICAgICAgIGFub25fa2V5OiBcImEyYjVlOWYzLTc0ZjAtNDgxMC05N2YyLWZhMTBmYzA1M2NjN1wiLFxuICAvLyAgICAgICBjb252ZXJzYXRpb25faWQ6IDkyMDA1MCxcbiAgLy8gICAgIH0pLFxuICAvLyAgIH0pO1xuICAvLyAgIHJldHVybiBuZXcgU3RyZWFtaW5nVGV4dFJlc3BvbnNlKHJlc3BvbnNlLmJvZHkpO1xuICAvLyB9XG4gIGNvbnN0IHJlc3BvbnNlID0gKGF3YWl0IGZldGNoKGBodHRwOi8vMzQuOTMuMjM2LjIzOS9hcGkvYXNrZG9jbmF2aWdhdG9yYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcHJvamVjdElkOlxuICAgICAgICBwcm9qZWN0SWQgPT09IFwiYnMtMTc4MlwiID8gXCI4ODAzODRkYS00NWU2LTQ5M2UtOWRlMC1mMzY0ZmIwOGYwOWFcIiA6IFwiXCIsXG4gICAgICBxdWVyeTogcHJvbXB0LFxuICAgICAgc291cmNlczogdHJ1ZSxcbiAgICAgIHNlc3Npb25JZCxcbiAgICB9KSxcbiAgfSlcbiAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh7IHJlcyB9KTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KSkgYXMgYW55O1xuICBjb25zb2xlLmxvZyhyZXNwb25zZS5ib2R5KTtcbiAgcmV0dXJuIG5ldyBTdHJlYW1pbmdUZXh0UmVzcG9uc2UocmVzcG9uc2U/LmJvZHkpO1xufVxuIl0sIm5hbWVzIjpbIlN0cmVhbWluZ1RleHRSZXNwb25zZSIsInJ1bnRpbWUiLCJQT1NUIiwicmVxIiwicmVxdWVzdCIsImpzb24iLCJwcm9tcHQiLCJwcm9qZWN0SWQiLCJzZXNzaW9uSWQiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJxdWVyeSIsInNvdXJjZXMiLCJ0aGVuIiwicmVzIiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwiZXJyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/chat/route.ts\n");

/***/ })

});