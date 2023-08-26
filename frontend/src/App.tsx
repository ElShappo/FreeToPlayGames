import React from 'react';
import { useState, useEffect } from 'react';
import { Card, List, Spin, Typography, Empty, Button, Popover, Space, Layout, Pagination, Select } from 'antd';
import './App.css'

import formatDate from './utils/formatDate';
import formatSearchParams from './utils/formatSearchParams';
import {platforms, genres, sorts} from './constants';
import {IGame, Platform, Genres, Sort} from './types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Meta } = Card;

function App() {
  let [games, setGames] = useState<IGame[]>([]); // list of games to display
  let [hasError, setHasError] = useState(false); // show error component istead of a list of games in case of an error

  let [page, setPage] = useState(1); // page No currently shown
  let [pageSize, setPageSize] = useState(10); // number of games on a single page

  let [platform, setPlatform] = useState<Platform>('any platform'); // current platform
  let [pickedGenres, setPickedGenres] = useState<Genres>('any genre'); // current genres
  let [sort, setSort] = useState<Sort>('relevance'); // current sort

  function onPlatformChange(value: Platform) {
    console.log(value);
    setPlatform(value);
    setPage(1);
    setPageSize(10);
  };

  function onGenresChange(value: Genres) {
    console.log(value);
    setPickedGenres(value);
    setPage(1);
    setPageSize(10);
  };

  function onSortChange(value: Sort) {
    console.log(value);
    setSort(value);
    setPage(1);
    setPageSize(10);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const timeout = 5000;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        let url: string;

        if (typeof pickedGenres === 'string') {
          url = `http://localhost:3002/games?platform=${platform}&genres=${pickedGenres}&sort=${sort}`;
        } else {
          // should be array
          url = `http://localhost:3002/games?platform=${platform}&sort=${sort}`
          for (let localGenre of pickedGenres) {
            url += `&genres=${localGenre}`;
          }
        }

        let response = await fetch(url, {
          signal: controller.signal
        });
        let json = await response.json();
        clearTimeout(timeoutId);
        
        console.log(response.status);
        console.log(json);

        setHasError(false);
        setGames(json);
      } catch (e) {
        console.error(e);
        setHasError(true);
      }
    };
    fetchGames();
  }, [platform, pickedGenres, sort]);
  

  if (games.length === 0 && hasError) {
    return (
      <div className="loading">
        <Empty description={
          <Title level={4} style={{textAlign: 'center'}}>Couldn't fetch games :(</Title>
        }>
        </Empty>
      </div>
    )
  } else if (games.length === 0 && !hasError) {
    return (
      <div className="loading">
        <Spin tip={<Title level={5} style={{textAlign: 'center'}}>Loading games...</Title>} size='large'>
            <div className="content" />
        </Spin>
    </div>
    )
  } else {
    return (
      <div className="App">
        <Layout>
          <Header className="mainHeader">
            <Title className="mainTitle">Games</Title>
          </Header>

          <Content>
            <Select
              showSearch
              onChange={onPlatformChange}
              options={formatSearchParams(platforms)}
              defaultValue={'any platform'}
              style={{ width: "9em" }}
            />
            <Select
              showSearch
              onChange={onGenresChange}
              options={formatSearchParams(genres)}
              defaultValue={'any genre'}
              style={{ width: "9em" }}
            />
            <Select
              showSearch
              onChange={onSortChange}
              options={formatSearchParams(sorts)}
              defaultValue={'relevance'}
              style={{ width: "9em" }}
            />
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 4,
              }}
              dataSource={games.slice((page - 1) * pageSize, page * pageSize)}
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.title} hoverable cover={
                    <img alt={item.title} src={item.thumbnail} />
                  }>
                    <Meta description={
                      <div style={{ fontSize: "1.1em" }}>
                        <Space size="small" wrap>
                          <Popover content="genre">
                            <Button type="primary" style={{backgroundColor: "#f50"}} size="small">{item.genre}</Button>
                          </Popover>
                          <Popover content="publisher">
                            <Button type="primary" style={{backgroundColor: "#f50"}} size="small">{item.publisher}</Button>
                          </Popover>
                          <Popover content="release date">
                            <Button type="primary" style={{backgroundColor: "#f50"}} size="small">{formatDate(item.release_date)}</Button>
                          </Popover>
                        </Space>
                      </div>
                    }/>
                  </Card>
                </List.Item>
              )}
            ></List>
          </Content>

          <Footer className="mainFooter">
            <Pagination current={page} pageSize={pageSize} total={games.length} onChange={(page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            }} />
          </Footer>
        </Layout>
    </div>
    )
  }
}

export default App;
