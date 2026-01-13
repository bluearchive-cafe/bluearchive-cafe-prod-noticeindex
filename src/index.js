export default {
    async fetch(request, env, ctx) {
        const pathname = new URL(request.url).pathname.slice(1)
        const pathparts = pathname.split("/");
        const uuid = pathparts.shift();
        const key = pathparts.join("/");
        const indexPath = "prod/index.json";
        const patchPath = "prod/patch.json";
        const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });

        if (pathname === indexPath || pathname === patchPath) return new Response(await env.NOTICEINDEX.get(pathname), { headers });
        else if (key === indexPath) {
            const index = JSON.parse(await env.NOTICEINDEX.get(indexPath));
            const patch = JSON.parse(await env.NOTICEINDEX.get(patchPath));
            const noticeindex = Object.fromEntries(
                Object.keys({ ...index, ...patch }).map(k =>
                    [k, Array.isArray(index[k]) && Array.isArray(patch[k]) ? [...index[k], ...patch[k]] : patch[k] ?? index[k]]
                )
            );
            const notice = {
                "NoticeId": 0,
                "StartDate": "2026-01-01T00:00:00",
                "EndDate": "2099-12-31T00:00:00",
                "Url": `https://prod-notice.bluearchive.cafe/prod/bluearchive-cafe/dash/index.html?uuid=${uuid}`,
                "Title": "汉化偏好设置",
                "DisplayOrder": 0
            };
            noticeindex.Issues.push(notice);
            return new Response(JSON.stringify(noticeindex, null, 2), { headers });
        }

        return Response.redirect("https://prod-noticeindex.bluearchiveyostar.com/" + key, 302);
    }
};
