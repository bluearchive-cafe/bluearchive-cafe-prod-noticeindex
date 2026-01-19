export default {
    async fetch(request, env, ctx) {
        const path = new URL(request.url).pathname.slice(1)
        const pathparts = path.split("/");
        const uuid = pathparts.shift();
        const key = pathparts.join("/");
        const indexKey = "prod/index.json";
        const patchKey = "prod/patch.json";
        const customKey = "prod/custom.json";
        const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });

        if (key === indexKey) {
            const index = await (await env.ASSETS.fetch(indexKey)).json();
            const patch = await (await env.ASSETS.fetch(patchKey)).json();
            const custom = await (await env.ASSETS.fetch(customKey)).json();
            const noticeindex = [index, patch, custom].reduce((acc, cur) => {
                for (const k in cur) {
                    if (Array.isArray(cur[k]) && Array.isArray(acc[k])) acc[k] = acc[k].concat(cur[k]);
                    else acc[k] = cur[k];
                }
                return acc;
            }, {});
            noticeindex.Issues.push({
                "NoticeId": 0,
                "StartDate": "2026-01-01T00:00:00",
                "EndDate": "2099-12-31T23:59:59",
                "Url": `https://bluearchive.cafe/dash.html?uuid=${uuid}`,
                "Title": "蔚蓝咖啡厅控制面板",
                "DisplayOrder": 0
            });
            return new Response(JSON.stringify(noticeindex, null, 2), { headers });
        }

        return Response.redirect("https://prod-noticeindex.bluearchiveyostar.com/" + key, 302);
    }
};
