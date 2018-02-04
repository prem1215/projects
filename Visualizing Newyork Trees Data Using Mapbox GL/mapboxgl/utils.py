import geojson
from collections import defaultdict
import math
import numpy as np
import pyproj

def df_to_geojson(df, properties=None, lat='lat', lon='lon', precision=None):
    """Serialize a Pandas dataframe to a geojson format Python dictionary
    """
    lat = df[lat]
    lon = df[lon]
    if precision:
        lat = lat.round(precision)
        lon = lon.round(precision)

    if properties is None: # allow empty properties list
        properties = list(df.columns)

    features = []
    for idx, row in df.iterrows():
        f = geojson.Feature(geometry=geojson.Point((lon[idx],lat[idx])),
                            properties={prop: row[prop] for prop in properties})
        features.append(f)
    fc = geojson.FeatureCollection(features)
    return fc

def scale_between(minval, maxval, numStops):
    """ Scale a min and max value to equal interval domain with 
        numStops discrete values
    """

    scale = []

    if numStops < 2:
        return [minval, maxval]
    elif maxval < minval:
        raise ValueError()
    else:
        domain = maxval - minval
        interval = domain/numStops
        for i in range(numStops):
            scale.append(round(minval + interval*i, 2))
        return scale


def create_radius_stops(breaks, min_radius, max_radius):
    """Convert a data breaks into a radius ramp
    """
    num_breaks = len(breaks)
    radius_breaks = scale_between(min_radius, max_radius, num_breaks)
    stops = []

    for i, b in enumerate(breaks):
        stops.append([b, radius_breaks[i]])
    return stops

SQRT3 = 1.73205080756887729352744634150587236

def hexbin(data, radius=1.0):
    """
    takes data and radius and gives back bins and centers of hexagons

    port of mbostock's d3-hexbin algorithm from https://github.com/d3/d3-hexbin/blob/master/src/hexbin.js
    """
    bins = defaultdict(int)
    centers = {}

    dx = radius * SQRT3
    dy = radius * 1.5

    for p in data:
        px, py = p[0], p[1]

        py = py / dy
        pj = int(round(py))
        px = px / dx - (pj & 1) / 2
        pi = int(round(px))
        py1 = py - pj

        if (abs(py1) * 3) > 1:
            px1 = px - pi
            pi2 = pi + (-1 if px < pi else 1) / 2
            pj2 = pj + (-1 if py < pj else 1)
            px2 = px - pi2
            py2 = py - pj2
            if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2):
                pi = round(pi2 + (1 if pj & 1 else -1) / 2)
                pj = pj2

        bin_key = (pi, pj)
        if bin_key not in centers:
            centers[bin_key] = ((pi + (pj & 1) / 2) * dx, pj * dy)
        bins[bin_key] += 1

    return bins, centers

def hexagon(radius):
    thirdPi = math.pi / 3
    angles = [0, thirdPi, 2 * thirdPi, 3 * thirdPi, 4 * thirdPi, 5 * thirdPi];

    points = [(math.sin(angle) * radius, -math.cos(angle) * radius)
              for angle in angles]
    return points

def create_hexagons(centers, bins, radius):
    mproj = pyproj.Proj("+init=EPSG:3857")  # Mercator

    h0 = hexagon(radius)
    features = []
    for (k, c) in sorted(centers.items()):  # need to know the i,j locations
        # flip back to lat, lon
        h = [mproj(pt[0] + c[0], pt[1] + c[1], inverse=True) for pt in h0]
        h.append(h[0])
        f = geojson.Feature(id=str(k), geometry=geojson.Polygon([h, ]),
                            properties={'count': bins[k]})
        features.append(f)
    fc = geojson.FeatureCollection(features)
    #     with open(fname,"w") as f:
    #         geojson.dump(fc,f)
    return fc

def df_to_hexbin(df, lat='lat', lon='lon',radius=1.0):

    mproj = pyproj.Proj("+init=EPSG:3857") # Mercator
    coords = df[[lon, lat]]
    res = mproj(*np.split(coords.values, 2, axis=1))
    projected = list(zip(res[0].transpose().tolist()[0], res[1].transpose().tolist()[0]))

    bins, centers = hexbin(projected, radius)
    fc = create_hexagons(centers, bins, radius)
    return fc, max(bins.values())
