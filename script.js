const sectionConfigs = [
  {
    key: "aiTutorial",
    target: '[data-section="aiTutorial"]',
    kicker: "01",
    title: "AI教程",
    description: "整理自 Notion 导出的 AI 教程数据，作为 AI 作品板块的延伸内容。",
    file: "./assets/data/ai.csv",
  },
  {
    key: "knife",
    target: "#dynamic-sections",
    kicker: "02",
    title: "菜刀大法",
    description: "直播主题与实战拆解内容，覆盖渠道、IP、转化和营销工具。",
    file: "./assets/data/knife.csv",
  },
  {
    key: "live",
    target: "#dynamic-sections",
    kicker: "03",
    title: "直播答疑",
    description: "社群内集中答疑内容，包含公开课与文字答疑。",
    file: "./assets/data/live.csv",
  },
  {
    key: "keywords",
    target: "#dynamic-sections",
    kicker: "04",
    title: "关键词引流训练营",
    description: "关键词搜索流量方向的直播、手册与答疑记录。",
    file: "./assets/data/keywords.csv",
  },
  {
    key: "ip",
    target: "#dynamic-sections",
    kicker: "05",
    title: "IP打造",
    description: "IP 基础、内容撰写、关键词引流、产品与矩阵相关内容。",
    file: "./assets/data/ip.csv",
  },
  {
    key: "writing",
    target: "#dynamic-sections",
    kicker: "06",
    title: "写作认知课",
    description: "适合新成员先整体过一遍的写作基础课程。",
    file: "./assets/data/writing.csv",
  },
  {
    key: "zhihu",
    target: "#dynamic-sections",
    kicker: "11",
    title: "知乎挖词引流/赚钱",
    description: "聚焦知乎渠道的关键词挖掘、内容撰写与蓝海词库使用。",
    file: "./assets/data/zhihu.csv",
  },
  {
    key: "topics",
    target: "#dynamic-sections",
    kicker: "07",
    title: "重点内容分类",
    description: "把小红书、知乎、微博等渠道的重点内容做了二次归类。",
    file: "./assets/data/topics.csv",
  },
  {
    key: "master",
    target: "#dynamic-sections",
    kicker: "08",
    title: "大力金刚掌",
    description: "社群内分享的精华内容，包括生产制造、渠道引流和营销工具。",
    file: "./assets/data/master.csv",
  },
  {
    key: "psychology",
    target: "#dynamic-sections",
    kicker: "09",
    title: "营销心理学",
    description: "围绕转化场景下的营销心理学效应所整理的内容。",
    file: "./assets/data/psychology.csv",
  },
  {
    key: "insight",
    target: "#dynamic-sections",
    kicker: "10",
    title: "洞察用户",
    description: "通过各类行业与人群报告，理解用户偏好和市场机会。",
    file: "./assets/data/insight.csv",
  },
];

async function fetchCsv(file) {
  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(`Failed to load ${file}`);
  }
  const raw = await response.text();
  return parseCsv(raw);
}

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;
  const normalized = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (char === '"') {
      if (quoted && next === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === "," && !quoted) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(current.trim());
      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current || row.length) {
    row.push(current.trim());
    if (row.some((cell) => cell !== "")) {
      rows.push(row);
    }
  }

  const [header = [], ...body] = rows;
  return body.map((cells) => {
    const entry = {};
    header.forEach((name, index) => {
      entry[name] = cells[index] || "";
    });
    return entry;
  });
}

function normalizeItem(item) {
  const title =
    item["内容标题"] ||
    item["名称"] ||
    item["Name"] ||
    item["标题"] ||
    "未命名内容";

  const url = item["链接"] || item["网址"] || "";
  const meta = [
    item["日期"],
    item["类型"],
    item["类别"],
    item["标签"],
    item["分类"],
    item["期数"],
  ].filter(Boolean);

  const description = item["备注"] || item["同学名称"] || "";

  return {
    title,
    url,
    meta,
    description,
  };
}

function createCard(item) {
  const card = document.createElement(item.url ? "a" : "article");
  card.className = "content-item";

  if (item.url) {
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noreferrer";
  }

  const title = document.createElement("h4");
  title.textContent = item.title;
  card.appendChild(title);

  if (item.meta.length) {
    const metaRow = document.createElement("div");
    metaRow.className = "meta-row";
    item.meta.slice(0, 3).forEach((text) => {
      const chip = document.createElement("span");
      chip.className = "meta-chip";
      chip.textContent = text;
      metaRow.appendChild(chip);
    });
    card.appendChild(metaRow);
  }

  if (item.description) {
    const description = document.createElement("p");
    description.textContent = item.description;
    card.appendChild(description);
  }

  return card;
}

function mountSection(config, items) {
  const template = document.querySelector("#section-template");
  const fragment = template.content.cloneNode(true);
  const block = fragment.querySelector(".content-block");

  fragment.querySelector(".content-kicker").textContent = config.kicker;
  fragment.querySelector("h3").textContent = config.title;
  fragment.querySelector(".content-desc").textContent = config.description;

  const list = fragment.querySelector(".content-list");
  items.forEach((item) => {
    list.appendChild(createCard(item));
  });

  document.querySelector(config.target).appendChild(block);
}

async function init() {
  for (const config of sectionConfigs) {
    try {
      const rows = await fetchCsv(config.file);
      const items = rows
        .map(normalizeItem)
        .filter((item) => item.title && (item.url || item.meta.length || item.description));

      if (items.length) {
        mountSection(config, items);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

init();
